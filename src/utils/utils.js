import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config'
import logger from './logger'

/**
 * Hashes the given password using bcrupt and a fixed number of salt rounds.
 *
 * @param {string} password
 * @returns {Promise}
 */
export async function hashPassword(password) {
  const saltRounds = 10

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  return hashedPassword
}

/**
 * Hashes the given password using bcrupt and a fixed number of salt rounds synchronously.
 *
 * @param {string} password
 * @returns {Promise}
 */
export function hashPasswordSync(password) {
  const saltRounds = 10

  const hashedPassword = bcrypt.hashSync(password, saltRounds)

  return hashedPassword
}

/**
 * Compares the given password with the actual user password to know
 * if they're the same.
 *
 * @param {string} passwordFromReq
 * @param {string} passwordFromDB
 * @returns {Promise}
 */
export async function comparePasswords(passwordFromReq, passwordFromDB) {
  if (!passwordFromReq || typeof passwordFromReq !== 'string') {
    logger.warn(
      'comparePasswords function was called without a passwordFromReq or is not of type string.'
    )

    throw new Error('An unexpected error ocurred during the process.')
  }

  if (!passwordFromDB || typeof passwordFromDB !== 'string') {
    logger.warn(
      'comparePasswords function was called without a passwordFromDB or is not of type string.'
    )

    throw new Error('An unexpected error ocurred during the process.')
  }

  return bcrypt.compareSync(passwordFromReq, passwordFromDB)
}

/**
 * Creates a new jwt Async.
 *
 * @param {object} payload
 * @returns {Promise}
 */
export const signJWTAsync = async payload => {
  const verification = await new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRATION
      },
      (err, token) => {
        if (err) reject(err)

        resolve(token)
      }
    )
  })

  return verification
}

/**
 * Creates a new jwt.
 *
 * @param {object} payload
 * @returns {Promise}
 */
export const signJWT = payload =>
  jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION
  })

/**
 * Verifies a JWT to check if it's valid Async.
 *
 * @param {object} code
 * @returns {Promise}
 */
export const verifyJWTAsync = async code => {
  const verification = await new Promise((resolve, reject) => {
    jwt.verify(code, config.JWT_SECRET, (err, decoded) => {
      if (err) reject(err)

      resolve(decoded)
    })
  })

  return verification
}

/**
 * Verifies a JWT to check if it's valid
 *
 * @param {object} code
 * @returns {Promise}
 */
export const verifyJWT = code => jwt.verify(code, config.JWT_SECRET)
