/**
 * Error thrown when an unexpected error occurs.
 * @class UnexpectedError
 * @extends {Error}
 */
export class UnexpectedError extends Error {
  constructor(msg) {
    super(msg)
    this.message =
      msg || 'An unexpected error happened processing your request.'
    this.status = 500
    this.name = 'UnexpectedError'
  }
}
