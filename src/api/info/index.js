/**
 * index.js - entry point of /api/info
 */
import express from 'express'

const router = express.Router()

router.route('/')
  .get((req, res) => {
    res.json({
      api_url: '/api/v1',
      api_version: 'v1',
      app_version: "0.0.1",
      api_info_url: '/api/info',
      api_name: 'n0dejs-api',
      author: "jason.zhuyx@gmail.com",
      copyright: "(c) 2016 dockerian",
      description: 'NodeJS API Server with ES6/ECMAScript 2015',
      test_url: '/hello'
    })
  })

export default router
