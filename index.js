const express = require('express');
const app = express();
const client = require('./db');

app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
      // Execute the SQL query to insert the user into the database
      const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
      const values = [name, email];
      const result = await client.query(query, values);

      const user = result.rows[0];
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  });

  const users = require('./routes/users')
  app.use("/api/v1" , users)

  app.listen(3000,()=>{
    console.log("Connected to server");
  })

