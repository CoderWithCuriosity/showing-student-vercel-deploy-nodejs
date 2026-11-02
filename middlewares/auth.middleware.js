const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authenticator(req, res, next){
    const authHeader =  req.headers.authorization;
    if(!authHeader){
        return res.json({
            message: 'No Auth Header'
        })
    }
    if(!authHeader.startsWith('Bearer ')){
        return res.json({
            message: 'No token found'
        })
    }

    // console.log(authHeader);
    //Bearer aldfjalfasdfksdlfjaslfkjsldfjaskfal
    //['Bearer', 'aldfjkadlalfasdf']
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        // console.log(decoded);
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({
            message: 'invalid token or expired token'
        })
    }
} 


module.exports = {authenticator};