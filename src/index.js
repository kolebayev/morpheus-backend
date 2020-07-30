
const express = require('express')
const app = express()
const cors = require('cors')
const port = 8000

app.use(cors())

app.post('/', (req, res) => res.send({message: 'Hello from express app!'}))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}!`))
