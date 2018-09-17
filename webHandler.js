'use strict';
const serverless = require('serverless-http')
const app = require('./web')

module.exports.handler = serverless(app)