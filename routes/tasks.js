const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');

const client = require('../db');
const authenticateToken = require('../userAuth');
app.use(express.json())

app.post('/', async (req, res) => {
    const { user_uid, title, description, status, due_date } = req.body;

    if (!user_uid || !title || !description || !status || !due_date) {
        return res.json({
            status: "failure",
            message: "please enter the required credentials!"
        })
    }
    try {
        const task_uid = uuidv4()

        const query = 'INSERT INTO tasks (user_uid , title , description , status, due_date) VALUES ($1, $2, $3,$4,$5)'
        const values = [user_uid, title, description, status, due_date]
        const result = await client.query(query, values)
        // const tasks = result.rows[0]
        // console.log(tasks);
        return res.json({
            status: "success",
            message: "Task created successfully!"
        })
    } catch (error) {
        res.json({
            status: "failure",
            message: error.message
        })
    }
})

app.get('/', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT * FROM tasks WHERE user_uid = $1'
        value = [req.user.id];
        const result = await client.query(query, value)
        const tasks = result.rows
        res.json(tasks)
    } catch (error) {
        res.json({
            status: "failure",
            message: error.message
        })
    }
})



module.exports = app;