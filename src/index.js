/**
 * index.js - entry point of root (/)
 */
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'

import apiRouter from './api'
// import * as middleware from './middleware'

var api = express()

api.use(morgan('dev'))
api.use(cookieParser())
// api.use(middleware.requestId)

api.use('/api', apiRouter)
api.use('/', apiRouter)

// api.use(middleware.errorHandler)

const PORT = process.env.PORT || 8888

api.listen(PORT)

// console logging and server starts listening ...

const CYAN = "\x1b[36m"
const GREEN = "\x1b[32m"
const NORM = "\x1b[0m"

console.log(`${GREEN}Server starts listening on ${CYAN}${PORT}${GREEN} ...${NORM}`)

import {
  getGreeting
} from './utils/str'

var args = process.argv.slice(2) // take args after `node run`

console.log(getGreeting(args[0]))
