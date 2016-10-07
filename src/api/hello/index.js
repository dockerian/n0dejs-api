/**
 * index.js - entry point of /app/hello/
 */
import express from 'express'
import * as m from './methods'

const router = express.Router()

router.get('/:name/:lang', m.get)
router.get('/:name', m.get)
router.get('/', m.get)

export default router
