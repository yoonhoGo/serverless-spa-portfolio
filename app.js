const express = require('express')

const app = express()

app.use('/static', (req, res) => {
  const staticURI = 'https://raw.githubusercontent.com/yoonhoGo/serverless-spa-portfolio/master/static'
  res.redirect(`${staticURI}${req.path}`)
})

app.get('/', (req, res) => {
  res.type('html').sendfile('index.html')
})

module.exports = app