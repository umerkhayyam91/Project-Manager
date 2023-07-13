const express = require('express');
const app = express();
const client = require('./db');

  const users = require('./routes/users')
  app.use("/api/v1/user" , users)
  
  const tasks = require('./routes/tasks')
  app.use("/api/v1/task" , tasks)

  app.listen(3000,()=>{
    console.log("Connected to server");
  })

