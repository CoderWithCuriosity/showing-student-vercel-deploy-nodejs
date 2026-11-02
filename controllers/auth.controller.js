const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const signup = async (req, res) => {
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
}

const login = async (req, res) => {
    try {
        console.log(req.body);
        const {email, password} = req.body;
        if(!email || !password) {
            return res.json({
                message: "All fields are required"
            });
        }

        const [result] = await pool.query("SELECT * from users WHERE email = ?", [email]);
        if(result.length <= 0) {
            return res.status(401).json({
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
        const {password: password_hash, name, id, ...mainInfo} = info;

        const token = jwt.sign({
            id: id,
            email: email
        }, process.env.SECRET, {
            expiresIn: '1h'
        });

        return res.json({
            message: "Login Successful!",
            details: mainInfo,
            token: token
        })
        

    } catch (error) {
        console.log(error)
        return res.json({
            message: "error",
            details: error.message
        });
        
    }
}

module.exports = {signup, login};