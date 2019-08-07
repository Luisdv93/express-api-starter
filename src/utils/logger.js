import fs from 'fs'
import winston, { format } from 'winston'
import config from '../config'

import 'winston-daily-rotate-file'

const { FILE_LOG_LEVEL, DISABLE_LOGS } = config
const LOG_DIR = 'logs'

// Create log directory if it does not exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR)
}

/*
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
*/

/* Logger instance. it will create a file inside the logs folder only for
msg that are info or above. */
const logger = winston.createLogger({
  transports: [
    /* new winston.transports.File({
      level: FILE_LOG_LEVEL,
      json: false,
      handleExceptions: true,
      maxsize: 5120000, // 5 MB
      maxFiles: 5,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm' // Optional for choosing your own timestamp format.
        }),
        format.printf(info => {
          const { timestamp, level, message, ...args } = info

          return `${timestamp} - ${level}: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
          }`
        })
      ),
      filename: `${__dirname}/../logs/logs.log`
    }), */
    new winston.transports.DailyRotateFile({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm' // Optional for choosing your own timestamp format.
        }),
        format.printf(info => {
          const { timestamp, level, message, ...args } = info

          return `${timestamp} - ${level}: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
          }`
        })
      ),
      maxFiles: '14d',
      level: FILE_LOG_LEVEL,
      dirname: LOG_DIR,
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%-debug.log'
    }),
    new winston.transports.Console({
      level: DISABLE_LOGS ? 'error' : 'debug',
      handleExceptions: true,
      format: format.combine(format.colorize(), format.simple())
    })
  ]
})

export default logger
