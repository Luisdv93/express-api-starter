import Joi from 'joi'
import joiValidate from '../../utils/joiValidate'

const userSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .min(6)
    .max(24)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required(),
  lastName: Joi.string()
    .min(2)
    .max(30)
    .required()
})

/**
 * Validate create/update user request.
 *
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 * @returns {Promise}
 */
export const validateUser = (req, res, next) =>
  joiValidate(req.body, userSchema)
    .then(() => next())
    .catch(err => next(err))

const loginSchema = Joi.object()
  .keys({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required()
  })
  .xor('username', 'email')

/**
 * Function to validate the login request.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 */
export const validateLogin = (req, res, next) =>
  joiValidate(req.body, loginSchema)
    .then(() => next())
    .catch(err => next(err))

const passwordUpdateSchema = Joi.object().keys({
  password: Joi.string()
    .min(6)
    .max(24)
    .required(),
  passwordConfirmation: Joi.string()
    .min(6)
    .max(24)
    .required()
    .valid(Joi.ref('password'))
    .options({
      language: {
        any: {
          allowOnly: 'Passwords do not match'
        }
      }
    })
})

/**
 * Function to validate the password update request.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 */
export const validatePasswordUpdate = (req, res, next) =>
  joiValidate(req.body, passwordUpdateSchema)
    .then(() => next())
    .catch(err => next(err))

const userUpdateSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required(),
  lastName: Joi.string()
    .min(2)
    .max(30)
    .required()
})

/**
 * Function to validate the update user request.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 */
export const validateUpdateUser = (req, res, next) =>
  joiValidate(req.body, userUpdateSchema)
    .then(() => next())
    .catch(err => next(err))
