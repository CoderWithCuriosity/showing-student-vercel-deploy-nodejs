const express = require("express");
const port = process.env.DB_PORT || 3000;
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const jwt = require('jsonwebtoken');
const {authenticator} = require('./middlewares/auth.middleware');
const {signup, login } = require('./controllers/auth.controller');
const {getDashboard, generate} = require('./controllers/dashboard.controller');
// const multer = require('multer');



const pool = require("./config/db");

app.use(express.json());
app.use(cors());

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({storage: storage});

// app.post('/upload', upload.single('avatar'), async (req, res) => {
//     if(!req.file){
//         res.res.status(400).send('Please upload a file')
//     }
//     console.log(req.file);
//     res.status(200).json({message: `File uploaded successfully! Saved as: ${req.file.filename}`});
// });

app.post('/signup', signup)

app.post('/login', login)

app.post('/userinfo', async (req, res) => {
    try {
        const {token} = req.body;
        if(!token ){
            return res.status(401).json({
                message: 'No token found'
            })
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        return res.status(200).json({
            message: "token refreshed!",
            details: decoded,
            token: token
        })

    } catch (error) {
        return res.status(401).json({
            message: "error",
            details: error
        });
    }
})

app.get('/dashboard', authenticator, getDashboard );

app.get('/generate', authenticator, generate);

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
        });
        
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