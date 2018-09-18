const AWS = require('aws-sdk')
const express = require('express')
const bodyParser = require('body-parser')

if (process.env.STAGE === 'local') {
  const credentials = new AWS.SharedIniFileCredentials({profile: 'isMe'});
  AWS.config.credentials = credentials;
}

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2',
})

const app = express()

app.use(bodyParser.json())

app.post('/api/contact', (req, res, next) => {
  if (!req.body.name) {
    throw new Error('please give a param `name`.')
  } else if (!req.body.subject) {
    throw new Error('please give a param `subject`.')    
  }
  next()
}, async (req, res) => {
  const portfolioContect = await dynamodb.put({
    TableName: 'portfolio-contact',
    Item: {
      createdAt: Date.now(),
      name: req.body.name,
      email: req.body.email || undefined,
      tel: req.body.tel || undefined,
      subject: req.body.subject,
      question: req.body.question || undefined,
    },
    // ReturnValues: 'ALL_NEW',
  }).promise()

  res.json(req.body)
})

module.exports = app