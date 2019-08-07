import _isEmpty from 'lodash/isEmpty'
import logger from '../utils/logger'
// import { IntegrityError } from '../utils/errors'

/**
 * Function that will wrap every route and catch error automatically.
 *
 * @param {function} fn
 * @returns
 */
export const processErrors = fn =>
  function(req, res, next) {
    fn(req, res, next).catch(next)
  }

/**
 * Middleware to handle empty JSON body requests and other edge cases if any.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export function emptyJson(req, res, next) {
  const { body, method } = req

  const disallowedHttpHeaders = ['PUT', 'POST', 'PATCH']

  if (
    req.is('application/json') &&
    disallowedHttpHeaders.includes(method) &&
    _isEmpty(body)
  ) {
    logger.warn('User sent an empty JSON.')

    res.status(200).json({
      message: 'Empty JSON',
      statusCode: 200
    })

    return
  }

  next()
}

/**
 * Middleware to handle any other types of errors.
 *
 * @param {Error} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export function validationErrorHandler(err, req, res, next) {
  if (err.isJoi) {
    logger.warn(
      'An error related to a joi validation just ocurred',
      err.details.map(err => ({
        message: err.message,
        param: err.path.join('.')
      }))
    )

    err.status = 400
    err.message = 'Your request did not pass the validation'
    err.details = err.details.map(err => ({
      message: err.message,
      param: err.path.join('.')
    }))
  }

  next(err)
}

/**
 * Error middleware for production enviroment, it will not provide
 * the stack trace.
 *
 * @param {Error} err
 * @param {object} _req
 * @param {object} res
 * @param {function} _next
 */
export const prodErrors = (err, _req, res, _next) => {
  logger.error(err.message)

  res.status(err.status || 500)

  res.send({
    name: err.name,
    message: err.message,
    statusCode: err.status,
    details: err.details || []
  })
}

/**
 * Error middleware for dev enviroment.
 *
 * @param {Error} err
 * @param {object} _req
 * @param {object} res
 * @param {function} _next
 */
export const devErrors = (err, _req, res, _next) => {
  logger.error(err.message)

  res.status(err.status || 500)

  res.send({
    name: err.name,
    message: err.message,
    statusCode: err.status,
    details: err.details || [],
    stack: err.stack || ''
  })
}
