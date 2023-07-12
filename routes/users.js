const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")

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
    const user = result.rows[0];
    console.log(result);
    if (!user) {
        return res.json({
            status: "failure",
            message: "user not found!"
        })
    }
    if (!email || !password) {
        return res.json({
            status: "failure",
            message: "please enter the required credentials!"
        })
    }
    try {
        console.log(password);
        console.log(user.password);
        if (await bcrypt.compare(password, user.password)) {
            res.json({
                'status': 'success',
                'message': "login successful",
            });

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

module.exports = app;