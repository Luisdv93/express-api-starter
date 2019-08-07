import { Strategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import logger from '../utils/logger'
import config from '../config'
import { getUser } from '../api/users/users.controllers'
import { UnauthorizedError } from '../api/users/users.errors'
import { UnexpectedError } from '../utils/errors'

const jwtOptions = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

/* JWT Auth Strategy to check if the user making the request has a 
token that matchesan user with a the same token in the DB */
const authJWT = new Strategy(jwtOptions, (jwtPayload, done) => {
  console.log(jwtPayload, done)
  getUser({ id: jwtPayload.id })
    .then(user => {
      console.log('user controller res', user)
      if (!user) {
        logger.info(
          `The JWT is not valid. User with id [${jwtPayload.id}] doesn't exist.`
        )
        done(
          new UnauthorizedError(
            "User not found or you didn't provide a valid token"
          ),
          null
        )

        return
      }

      logger.info(
        `User [${
          user.username
        }] provided a valid JWT. Authentication completed.`
      )

      done(null, {
        username: user.username,
        id: user.id
      })
    })
    .catch(error => {
      logger.error('An error occurred while validating a token', error)

      done(new UnexpectedError())
    })
})

export default authJWT

export const jwtValidate = passport.authenticate('jwt', { session: false })
