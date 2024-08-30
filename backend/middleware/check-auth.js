const CONFIG = require('../config/index')
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).json({
            message: "Authorization token is missing."
        })
    }
    
    try {
        const [ token_keyword, token ] = req.headers.authorization.split(" ")
        
        if(token_keyword !== "Bearer") {
            return res.status(400).json({
                message: "Invalid bearer token."
            })
        }
        const decodedToken = jwt.verify(token, CONFIG.JWT_KEY)
        
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        }
        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({
                message: 'Incorrect token provided'
            })
        }
        return res.status(400).json({
            message: error.message
        })
    }
}