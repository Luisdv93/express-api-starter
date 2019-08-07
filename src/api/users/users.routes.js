import express from 'express'
import { processErrors } from '../../middlewares/errorHandlers'
// import validateId from '../../middlewares/validateId'
import { jwtValidate } from '../../middlewares/auth'
import {
  createUserService,
  loginUserService,
  // updateUserService,
  changePasswordService,
  getAllUsersService
  // getUserService,
  // verificationService,
  // deleteUserService,
} from './users.services'
import {
  validateUser,
  validateLogin,
  // validateUpdateUser,
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
 * PUT /api/users/update/:id
 * Route to update an user
 */
/* usersRoutes.put(
  '/update/:id',
  [validateId, jwtValidate, validateUpdateUser],
  processErrors(updateUserService)
) */

/**
 * GET /api/users/
 * Route to list all users
 */
usersRoutes.get('/', [jwtValidate], processErrors(getAllUsersService))

/**
 * GET /api/users/:id
 * Route to list an specific user
 */
/* usersRoutes.get(
  '/:id',
  [validateId, jwtValidate],
  processErrors(getUserService)
) */

/**
 * DELETE /api/api/users/:id
 * Route delete an user
 */
/* usersRoutes.delete(
  '/:id',
  [validateId, jwtValidate],
  processErrors(deleteUserService),
  processErrors(getAllUsersService)
) */

/**
 * PUT /api/users/verification
 * Route to verify the token from the email.
 * params: { code }
 */
/* usersRoutes.put('/verification', processErrors(verificationService)) */

export default usersRoutes
