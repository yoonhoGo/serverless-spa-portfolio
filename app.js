const express = require('express')

const app = express()

app.get('/', (req, res) => res.send('Ok! Hello world!'))

module.exports = app