const express = require('express')

const app = express()
const router = express.Router()

router.use('/static', (req, res) => {
  const staticURI = 'https://raw.githubusercontent.com/yoonhoGo/serverless-spa-portfolio/master/static'
  res.redirect(`${staticURI}${req.path}`)
})

router.get('/', (req, res) => {
  res.type('html').sendfile('index.html')
})

// app.use(process.env.NODE_ENV === 'production' ? `/${process.env.STAGE}` : '/', router)
app.use(router)

module.exports = app