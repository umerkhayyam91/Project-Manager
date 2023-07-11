const { Client } = require('pg')
const client = new Client({
    user: "postgres",
    password: "emmawatson123",
    host: "localhost",
    port: 5432,
    database: "task_manager"
})

client.connect()
    .then(() => console.log("DB Connected"))
    .catch(error => console.log(error))

module.exports = client;

