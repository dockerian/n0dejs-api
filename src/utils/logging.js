/**
 * logging.js - API server logging
 */
import _ from 'lodash'
import winston from 'winston'
import winston_cbuff from 'winston-circular-buffer'

winston.emitErrs = true

var logLevel = process.env.LOGLEVEL || 'debug'

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: logLevel,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: false
    }),
    new winston.transports.CircularBuffer({
      name: 'buffer',
      level: logLevel,
      json: true,
      size: 100
    })
  ],
  exitOnError: false
})

logger.stream = {
  write: (message, encoding) => {
    logger.info(message)
  }
}

logger.getEntriesForId = function getEntriesForId(requestId, callback) {
  // make this asynchronous.
  setTimeout(() => {
    logger.query({
      json: true,
      order: 'asc'
    }, (err, entries) => {
      if (err) {
        logger.error(err)
        entries = []
      }

      return callback(_.filter(entries['buffer'], (entry) => {
        return (
          entry &&
          entry.message &&
          entry.message.indexOf(requestId) !== -1)
      }))
    })
  }, 0)
}

logger.shim = function shim(logger, shimText) {
  function writeTo(type) {
    return function () {
      arguments[0] = `${shimText} : ${arguments[0]}`
      logger[type].apply(logger, arguments)
    }
  }

  return {
    log: writeTo('log'),
    info: writeTo('info'),
    warn: writeTo('warn'),
    error: writeTo('error'),
    debug: writeTo('debug')
  }
}

export default logger
