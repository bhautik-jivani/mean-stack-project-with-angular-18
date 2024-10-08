const CONFIG = require('../config/index')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                return res.status(400).json({
                    message: 'User already registered with given email, Please enter another email.'
                })
            }

            const userObj = new User({
                email: req.body.email,
                password: hash
            })
            userObj.save().then((resp) => {
                res.status(201).json({
                    message: 'User created successfully',
                    user: resp
                })
            }).catch((error) => {
                res.status(500).json({
                    message: "Something went wrong!",
                    ...error
                })
            })
        }).catch((err) => {
            return res.status(401).json({
                message: `Authentication failed! due to ${err}`,
            })
        })
    })
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email}).then((user) => {
        if (!user) {
            return res.status(400).json({
                message: 'User not registered with given email, Please try to Signup.'
            })
        }
        fetchedUser = user
        return bcrypt.compare(req.body.password, user.password)
    }).then((result) => {
        if(typeof result === "object") {
            return result
        }

        if (!result) {
            return res.status(401).json({
                message: 'Invalid password founded!'
            })
        }
        
        const token = jwt.sign(
            {
                email: fetchedUser.email,
                userId: fetchedUser._id
            },
            CONFIG.JWT_KEY,
            {
                expiresIn: '1h'
            }
        )

        res.status(200).json({
            email: fetchedUser.email,
            userId: fetchedUser._id,
            token: token,
            expiresIn: 3600 // Seconds
        })
    }).catch((err) => {
        return res.status(401).json({
            message: `Authentication failed! due to ${err}`,
        })
    })
}