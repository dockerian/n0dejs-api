/**
 * index.js - entry point of /api
 */
import express from 'express'
import hello from './hello'
import info from './info'
import v1 from './v1'

const apiRouter = express.Router()

// routing to other shortcuts under root (/)
apiRouter.use('/hello', hello)
// TODO: https://jsfiddle.net/jason_zhuyx/wwxd54u8/
// apiRouter.use('/game', hello)
apiRouter.use('/info', info)
apiRouter.use('/v1', v1)

apiRouter.get('/', info)

export default apiRouter
