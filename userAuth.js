const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
require("dotenv").config()

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    console.log(token);
    if (token == null) return res.status(401).json({
        'status': 'failure',
        'message': "not allowed"
    });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({
            "status": "failure",
            "message": "Your session has expired. Please log in again."
        })
        console.log("object")
        req.user = user
        console.log(req.user);
        next();
    });
}

module.exports = authenticateToken;