import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import compression from 'compression'
import passport from 'passport'
import cors from 'cors'
import * as Sentry from '@sentry/node'

import logger from './utils/logger'
import config from './config'
import './config/db'
import {
  prodErrors,
  devErrors,
  emptyJson,
  validationErrorHandler
} from './middlewares/errorHandlers'
import authJWT from './middlewares/auth'
import routes from './api/routes'

dotenv.config()

// Initialize Sentry
// https://docs.sentry.io/platforms/node/express/
Sentry.init({ dsn: process.env.SENTRY_DSN })

const app = express()

/* Initial Config for Server */
const APP_PORT =
  config.NODE_ENV === 'test' ? config.TEST_APP_PORT : config.APP_PORT

const { APP_HOST } = config

app.set('port', APP_PORT)
app.set('host', APP_HOST)

app.locals.title = config.APP_NAME
app.locals.version = config.APP_VERSION

/* Middlewares */
// This request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())
passport.use(authJWT)
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(
  morgan('short', {
    stream: {
      write: message => logger.info(message.trim())
    }
  })
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.text())
app.use(passport.initialize())

// Validate that the incoming JSON is not empty. This is not an error handler
app.use(emptyJson)

app.use('/api', routes)

// This error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler())

// Error middlewares
app.use(validationErrorHandler)

if (process.env.NODE_ENV === 'prod') {
  app.use(prodErrors)
} else {
  app.use(devErrors)
}

const server = app.listen(app.get('port'), app.get('host'), () => {
  logger.info(
    `Server started at http://${app.get('host')}:${app.get('port')}/api`
  )
})

// Catch unhandled rejections
process.on('unhandledRejection', err => {
  logger.error('Unhandled rejection', err)

  try {
    Sentry.captureException(err)
  } catch (err) {
    logger.error('Raven error', err)
  } finally {
    process.exit(1)
  }
})

// Catch uncaught exceptions
process.on('uncaughtException', err => {
  logger.error('Uncaught exception', err)

  try {
    Sentry.captureException(err)
  } catch (err) {
    logger.error('Raven error', err)
  } finally {
    process.exit(1)
  }
})

export { app, server }
