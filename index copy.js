// const dotenv = require('dotenv');
// dotenv.config();
// const pool = require('./config/db');
// const express = require('express');
// const cors = require('cors');
// const port = process.env.PORT || 3000;
// const app = express();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// app.use(cors());startsWith
// app.use(express.json());

// function authentication(req, res, next){
//     const authHeader = req.headers.authorization;
//     if(!authHeader || !authHeader.('Bearer ')){
//         return res.status(401).json({
//             message: 'No token provided'
//         });
//     }
//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next()
//     } catch (error) {
//         return res.json({
//             message: 'Invalid or expired token'
//         })
//     }
// }

// app.post('/signup', async (req, res) => {
//     try {
//         const data = req.body;
//         if(!data.firstname || !data.lastname || !data.age ||  !data.email || !data.password){
//             return res.json({
//                 message: 'All fields are required'
//             })
//         }
//         console.log(data);
//         const hashedpassword = await bcrypt.hash(data.password, 10);
//         console.log(hashedpassword);


//         const [result] = await pool.query('INSERT INTO users (email, password_hash, first_name, last_name, age) VALUES (?, ?, ?, ?, ?)', [data.email, hashedpassword, data.firstname, data.lastname, data.age  ]);
//         const userId = result.insertId;
        
//         const token = jwt.sign({
//             id: userId, 
//             email: data.email,
//             firstname: data.firstname, 
//             lastname: data.lastname,
//             age: data.age
//         }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

//         const {password, ...newdata } = data;

//         return res.json({
//             message: 'Sign up successful',
//             token: token,
//             user: newdata
//         });
//     } catch (error) {
//         if(error.code == "ER_DUP_ENTRY"){
//             return res.json({
//                 message: "Email already exists"
//             })
//         }
//         return res.json({
//             message: 'An error occurred',
//             error: error
//         })
//     }
// });

// app.post('/login', async (req, res) => {
//     try {
//         const {email, password} = req.body;
//         if(!email || !password){
//             return res.json({
//                 message: 'All fields are required'
//             });
//         }

//         const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
//         console.log(result);
//         if(result.length <= 0){
//             return res.json({
//                 error: 'Invalid email and password'
//             });
//         }

//         const userinfo = result[0];

//         const checkpass = await bcrypt.compare(password, userinfo.password_hash);
//         if(checkpass == false){
//             return res.json({
//                 error: "password is incorrect"
//             });
//         }

//         const {password_hash, created_at, updated_at, ...otherinfo} = userinfo;

//         return res.json({
//             message: 'Login Successful',
//             user: otherinfo
//         })

//     } catch (error) {
//         return res.status(401).json({
//             message: 'Contact Customer Support'
//         })
//     }
// })

// app.get('/dashboard', authentication, (req, res) => {
//     return res.json({
//         message: 'Good day mr ',
//         user: req.user
//     })
// })

// app.listen(port, () => {
//     console.log('Server is listening at port: ', port);
// });

const express = require("express");
const port = process.env.DB_PORT || 3000;
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const pool = require("./config/db");

app.use(express.json());
app.use(cors());



app.post('/signup', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.json({
                message: "All fields are required"
            });
        }
        
        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password_hash]);
       return res.json({
        message: "Registration Successful"
       })


    } catch (error) {
        console.log(error)
        return res.json({
            message: "error",
            details: error.message
        });
        
    }
})

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.json({
                message: "All fields are required"
            });
        }

        const [result] = await pool.query("SELECT * from users WHERE email = ?", [email]);
        if(result.length <= 0) {
            return res.json({
                error: "Invalid email or password"
            })
        }
        const info = result[0];

        const auth = await bcrypt.compare(password, info.password);
        if(auth == false){
            return res.json({
                error: "Password is incorrect!"
            })
        }
        const {password: password_hash, id, name, ...mainInfo} = info;

        return res.json({
            message: "Login Successful!",
            details: mainInfo
        })
        

    } catch (error) {
        console.log(error)
        return res.json({
            message: "error",
            details: error.message
        });
        
    }
})



app.post('/books', async (req, res) => {
    try {
        const data = req.body;
        if(!data.title || !data.author || !data.genre || !data.year_published){
            return res.json({
                message: "Enter all fields"
            })
        }

        const [result] = await pool.query("INSERT INTO books (user_id, title, author, genre, year_published) VALUES (?, ?, ?, ?, ?)", [1, data.title, data.author, data.genre, data.year_published]);
        return res.json({
            message: "book has been added"
        }) 
        
    } catch (error) {
        console.log(error);
        return res.status(401).json(
            {
                message: "unauthorized gateway"
            }
        )
    }

})


app.delete("/books", async (req, res) => {

    try {
        const books = req.body;
        if(!books.id){
            return res.json({
                message: "Not Found"
            })
        }


        const [result] = await pool.query("DELETE FROM books WHERE id = ?", [books.id]);

        if(result.affectedRows == 0) {
            return res.json({
                message: "No Deleted Book"
            })
        }

        console.log(result)
        return res.json({
            message: "Deleted Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                message: "Cannot be completed"
            }
        )
        
    }
}) 


app.post("/booky", async (req, res) => {

    try {
        const books = req.body;
        if(!books.id){
            return res.json({
                message: "book not found"
            })
        }

        const [result] = await pool.query("SELECT * FROM books WHERE id = ?", [books.id]);
        if(result.length == 0) {
            return res.json({
                message: "Book not found"
            })
        }
        
        return res.json({
            message: "Book found"
        })

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "book not found"
        })
        
    }

})


app.listen(port, () => {
    console.log("server is observing on port: ", port);
})