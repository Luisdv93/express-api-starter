import logger from '../../utils/logger'
import { hashPassword, comparePasswords, signJWTAsync } from '../../utils/utils'
import { UserInfoInUse, InvalidCredentials } from './users.errors'
import {
  createUser,
  checkUserRegistration,
  checkUserLogin,
  updateUser,
  getAllUsers
} from './users.controllers'

/**
 * Service to create a new User.
 *
 * @param {object} req
 * @param {object} res
 */
export const createUserService = async (req, res) => {
  const newUser = req.body

  newUser.username = newUser.username.toLowerCase()
  newUser.email = newUser.email.toLowerCase()

  const userExists = await checkUserRegistration(
    newUser.username,
    newUser.email
  )

  if (userExists.length > 0) {
    logger.warn(
      `Email [${newUser.email}] or username [${
        newUser.username
      }] already exists.`
    )

    throw new UserInfoInUse()
  }

  const hashedPassword = await hashPassword(newUser.password)

  const createdUser = await createUser(newUser, hashedPassword)

  logger.info(
    `User [${newUser.username}] completed the register process sucessfully.`
  )

  res.status(201).json({
    message: 'User registration completed',
    response: createdUser,
    statusCode: 201
  })
}

/**
 * Service to perfom a login.
 *
 * @param {object} req
 * @param {object} res
 */
export const loginUserService = async (req, res) => {
  const credentials = req.body

  const registeredUser = await checkUserLogin(
    credentials.username && credentials.username.toLowerCase(),
    credentials.email && credentials.email.toLowerCase()
  )

  if (!registeredUser) {
    logger.warn(
      `User [${credentials.username}] or [${
        credentials.email
      }] doesn't exist. Authentication failed.`
    )

    throw new InvalidCredentials()
  }

  const correctPassword = await comparePasswords(
    credentials.password,
    registeredUser.password
  )

  if (!correctPassword) {
    logger.warn(
      `User [${credentials.username}] or [${
        credentials.email
      }] failed the authentication. Incorrect password.`
    )

    throw new InvalidCredentials()
  }

  const token = await signJWTAsync({
    id: registeredUser.id,
    username: registeredUser.username
  })

  const updatedUser = await updateUser(registeredUser.id, { token })

  logger.info(
    `User [${credentials.username}] or [${
      credentials.email
    }] completed the authentication.`
  )

  res.status(200).json({
    message: 'User logged in sucessfully',
    response: { ...updatedUser, token },
    statusCode: 200
  })
}

/**
 * Service to perfom a password update.
 *
 * @param {object} req
 * @param {object} res
 */
export const changePasswordService = async (req, res) => {
  const newPassword = req.body.password

  const updatedUser = await updateUser(req.user.id, { password: newPassword })

  logger.info(`User [${updatedUser.username}] updated his password.`)

  res.status(200).json({
    message: 'Password updated sucessfully',
    response: {},
    statusCode: 200
  })
}

/**
 * Service to list all the users.
 *
 * @param {object} req
 * @param {object} res
 */
export const getAllUsersService = async (req, res) => {
  const users = await getAllUsers()

  logger.info(
    `The users list was consulted with a count of: [${users.length}] `
  )

  res.status(200).json({
    message: 'User list fetched sucessfully',
    response: users,
    count: users.length,
    statusCode: 200
  })
}
