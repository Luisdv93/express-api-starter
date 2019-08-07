/**
 * Class to define an invalid id provided in the url
 * @class InvalidId
 * @extends {Error}
 */
class InvalidId extends Error {
  /**
   * Creates an instance of InvalidId.
   *
   * @param {string} msg
   * @memberof InvalidId
   */
  constructor(msg) {
    super(msg)
    this.message = msg || 'The id provided in the URL is not valid.'
    this.status = 400
    this.name = 'InvalidId'
  }
}

/**
 * Middleware to validate an id. It will grab the id from the params
 * and try to match it to the regular expression to see
 * if it's valid or not.
 *
 * @param {Object} req
 * @param {Object} _res
 * @param {Function} next
 */
export default (req, _res, next) => {
  const { id } = req.params

  if (id.match(/^[0-9]{1,24}$/) === null) {
    throw new InvalidId(`The id [${id}] provided in the URL is not valid.`)
  }

  next()
}
