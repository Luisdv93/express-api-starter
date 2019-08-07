import User from './users.model'

// Safe rows to pick for user, omits password and timestamps
const safeRows = [
  'id',
  'username',
  'email',
  'firstName',
  'lastName',
  'isVerified'
]

/**
 * Returns an array of all the users in the database.
 *
 * @returns {array}
 */
export const getAllUsers = () => {
  const selectedRows = [
    'id',
    'username',
    'email',
    'firstName',
    'lastName',
    'isVerified',
    'updatedAt',
    'createdAt'
  ]

  return User.query().select(selectedRows)
}

/**
 * Creates a new user in the database and returns it.
 *
 * @param {object} user
 * @param {string} hashedPassword
 * @returns {object}
 */
export const createUser = (user, hashedPassword) =>
  User.query()
    .insert({ ...user, password: hashedPassword })
    .pick(safeRows)

/**
 * Checks if the user exists in the DB by checking the
 * username or the email for the register process
 *
 * @param {string} username
 * @param {string} email
 * @returns {object}
 */
export const checkUserRegistration = (username, email) => {
  if (!username || !email)
    throw new Error(
      'checkUserRegistration Function of the User Controller was called without specifying username and email.'
    )

  return User.query()
    .where({ username })
    .orWhere({ email })
}

/**
 * Checks if the user exists in the DB by checking the
 * username or the email for the login process
 *
 * @param {string} username
 * @param {string} email
 * @returns {object}
 */
export const checkUserLogin = (username, email) => {
  if (username) {
    return User.query().findOne({ username })
  }

  if (email) {
    return User.query().findOne({ email })
  }

  throw new Error(
    'checkUserLogin Function of the User Controller was called without specifying username and email.'
  )
}

/**
 * Fetch a specific user from the database using the id or the username.
 *
 * @param {object} user
 * @returns {object}
 */
export const getUser = user => {
  const { id, username } = user

  if (id) return User.query().findById(id)

  if (username)
    return User.query().findOne({
      username
    })

  throw new Error(
    'getUser Function of the User Controller was called without specifying id or username.'
  )
}

/**
 * Updates a single user using their id.
 *
 * @param {string} id
 * @param {object} updatedData
 * @returns {object}
 */
export const updateUser = (id, updatedData) => {
  if (id)
    return User.query()
      .patchAndFetchById(id, updatedData)
      .pick(safeRows)

  throw new Error(
    'updateUser Function of the User Controller was called without specifying an id datA.'
  )
}

/**
 * Deletes an specific user.
 *
 * @param {string} id
 * @returns
 */
export const deleteUser = id => {
  if (id) return User.query().deleteById(id)

  throw new Error(
    'deleteUser Function of the controller was called without specifiying an id'
  )
}
