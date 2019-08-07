/**
 * Error thrown when the username or the email that the user is trying to use to
 * register are already in use
 * @class UserInfoInUse
 * @extends {Error}
 */
export class UserInfoInUse extends Error {
  /**
   * Creates an instance of UserInfoInUse.
   *
   * @param {string} msg
   * @memberof UserInfoInUse
   */
  constructor(msg) {
    super(msg)
    this.message =
      msg || 'The email or username are already associated to an account.'
    this.status = 409
    this.name = 'UserInfoInUse'
  }
}

/**
 * Error thrown when the credentials provided for the login
 * are incorrect.
 * @class InvalidCredentials
 * @extends {Error}
 */
export class InvalidCredentials extends Error {
  /**
   * Creates an instance of InvalidCredentials.
   *
   * @param {string} msg
   * @memberof InvalidCredentials
   */
  constructor(msg) {
    super(msg)
    this.message =
      msg ||
      'Invalid credentials. Make sure the username/email and password are correct.'
    this.status = 400
    this.name = 'InvalidCredentials'
  }
}

/**
 * Error thrown when the user doesn't exist
 * @class UserNotFound
 * @extends {Error}
 */
export class UserNotFound extends Error {
  /**
   * Creates an instance of UserNotFound.
   *
   * @param {string} id
   * @memberof UserNotFound
   */
  constructor(id) {
    super(id)
    this.message = `The user with ID [${id}] was not found or doesn't exist. Make sure you provided the correct one ID.`
    this.status = 404
    this.name = 'UserNotFound'
  }
}

/**
 *
 * Error thrown when there's an authorization error
 * @class UnauthorizedError
 * @extends {Error}
 */
export class UnauthorizedError extends Error {
  /**
   * Creates an instance of UnauthorizedError.
   * @param {string} msg
   * @memberof UnauthorizedError
   */
  constructor(msg) {
    super(msg)
    this.message = msg || 'Unauthorized.'
    this.status = 401
    this.name = 'UnauthorizedError'
  }
}
