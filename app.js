const express = require('express')

const app = express()

app.get('/static', (req, res) => {
  const staticURI = 'https://github.com/yoonhoGo/serverless-spa-portfolio/blob/master/static'
  res.redirect(301, `${staticURI}/${req.path}`)
})

app.get('/', (req, res) => {
  res.type('html').sendfile('index.html')
})

module.exports = app