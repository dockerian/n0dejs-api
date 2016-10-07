/**
 * index.js - entry point of /api/v1
 */
import express from 'express'

const router = express.Router()

router.route('/')
  .get((req, res) => {
    res.json({
      version: 'v1'
    })
  })

export default router
