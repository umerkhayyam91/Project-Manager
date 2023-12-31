const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
require("dotenv").config()

const client = require('../db');
app.use(express.json())

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    if (!email || !name || !password) {
        return res.json({
            status: "failure",
            message: "please enter the required credentials!"
        })
    }
    try {
        const user_uid = uuidv4(); // Generate a UUID
        // Execute the SQL query to insert the user into the database
        const query = 'INSERT INTO users (user_uid,name, email, password) VALUES ($1, $2, $3,$4)';
        const values = [user_uid, name, email, hashedPassword];
        const result = await client.query(query, values);

        // const user = result.rows[0];
        return res.json({
            status: "success",
            message: "User created successfully!"
        })
    } catch (error) {
        res.json({
            status: "failure",
            message: error.message
        })
    }
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({
            status: "failure",
            message: "please enter the required credentials!"
        })
    }
    const query = 'SELECT * FROM users WHERE email = $1';
    values = [email];
    const result = await client.query(query, values)
    const User = result.rows[0];
    if (!User) {
        return res.json({
            status: "failure",
            message: "User not found!"
        })
    }
    if (!email || !password) {
        return res.json({
            status: "failure",
            message: "please enter the required credentials!"
        })
    }
    try {

        if (await bcrypt.compare(password, User.password)) {
            const user = { id: User.user_uid }
            console.log(User.user_uid);

            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            res.json({ accessToken: accessToken, refreshToken: refreshToken })

        } else {
            res.json({
                'status': 'failure',
                'message': "wrong password",
            });
        }
    } catch (error) {
        res.json({
            'status': 'failure',
            'message': error.message,
        });
    }

});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

module.exports = app;