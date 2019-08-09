import express from 'express'
import { processErrors } from '../../middlewares/errorHandlers'
import { jwtValidate } from '../../middlewares/auth'
import {
  createUserService,
  loginUserService,
  changePasswordService,
  getAllUsersService
} from './users.services'
import {
  validateUser,
  validateLogin,
  validatePasswordUpdate
} from './users.validate'

const usersRoutes = express.Router()

/**
 * POST /api/users/register
 * Create a new user if the username or the email used are not already
 * taken by another user.
 */
usersRoutes.post('/register', validateUser, processErrors(createUserService))

/**
 * POST /api/users/login
 * Route to log in an user
 */
usersRoutes.post('/login', validateLogin, processErrors(loginUserService))

/**
 * PUT /api/users/change-password
 * Route to change the user password
 */
usersRoutes.put(
  '/change-password',
  [jwtValidate, validatePasswordUpdate],
  processErrors(changePasswordService)
)

/**
 * GET /api/users/
 * Route to list all users
 */
usersRoutes.get('/', [jwtValidate], processErrors(getAllUsersService))

export default usersRoutes
