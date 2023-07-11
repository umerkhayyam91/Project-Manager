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
        const query = 'INSERT INTO users (user_uid,name, email, password) VALUES ($1, $2, $3,$4) RETURNING *';
        const values = [user_uid, name, email, hashedPassword];
        const result = await client.query(query, values);

        const user = result.rows[0];
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

module.exports = app;