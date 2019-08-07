import Joi from 'joi'

/**
 * Utility helper for Joi validation.
 *
 * @param {object} data
 * @param {object} schema
 * @returns {Promise}
 */
export default function joiValidate(data, schema) {
  return Joi.validate(
    data,
    schema,
    { abortEarly: false, convert: true },
    err => {
      if (err) {
        return Promise.reject(err)
      }

      return Promise.resolve(null)
    }
  )
}
