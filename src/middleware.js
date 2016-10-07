/**
 * middleware.js - middleware for /
 */
import _ from 'lodash'
import bodyParser from 'body-parser'
import httpStatus from 'http-status-codes'
import morgan from 'morgan'
import uuid from 'uuid'

import * as utils from './utils'

export function errorHandler(err, req, res, next) {
  var errorStatus
  if (res.headersSent) {
    // log a warning and close the response
    req.logger.error('Next was called, but the response headers have been sent.', err)
    return res.end()
  }

  if (err.constructor.name === 'ORMError') {
    err.status = err.literalCode === 'NOT_FOUND' ? 404 : 500
  }

  errorStatus = parseInt(err.status)
  if (!errorStatus || !checkStatusCode(errorStatus)) {
    err.status = 500
  }

  if (err.status === 500) {
    // Only log this when we have an unexpected error.
    req.logger.error('Next was called with an error.', err)
  }

  utils.logger.getEntriesForId(req.id, (entries) => {
    res.status(err.status)
    res.json({
      message: err.message,
      details: err.details || '',
      status: err.status,
      api_version: 2,
      log: entries
    })

    return next()
  })
}

export function requestId(req, res, next) {
  req.id = uuid.v4()
  res.header('Request-ID', req.id)
  req.logger = utils.logger.shim(utils.logger, req.id)

  return next()
}

export function serializer(req, res, next) {
  var send = res.send
  res.send = function sendSerializer(contents) {
    if (contents instanceof Object && contents.serialize instanceof Function) {
      contents = contents.serialize()
    }

    if (contents instanceof Array) {
      _.each(contents, (v, i) => {
        if (v.serialize instanceof Function) {
          contents[i] = v.serialize()
        }
      })
    }

    return send.call(res, contents)
  }

  return next()
}


function checkStatusCode(statusCode) {
  try {
    httpStatus.getStatusText(statusCode)
    return true
  } catch (err) {}

  return false
}
