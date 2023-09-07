
const express = require('express')
const PORT = 3001
const app = express()

app.use(express.static('public'))

app.get('/say-hello', (req, res) => {
    res.send("Hello from the server side!")
})

app.listen(3001, () => {
    console.info(`The server is active, listening on port ${PORT}`)
})
