
const express = require('express')
const PORT = 3001
const app = express()

app.use(express.static('public'))

app.get('/say-hello', (req, res) => {
    res.send("Hello from the server side!")
})

app.get('/status', (req, res) => {
    // Delay the response to give the visual indicator some time to live.
    setTimeout(function () {
        res.send("<img class=\"max-w-[10%]\" src=\"ok.png\" />")
    }, 2000)
})

app.listen(3001, () => {
    console.info(`The server is active, listening on port ${PORT}`)
})
