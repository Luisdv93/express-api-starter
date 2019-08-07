import request from 'supertest'
import { comparePasswords, hashPasswordSync } from '../utils/utils'
import { app, server } from '../index'
import User from '../api/users/users.model'

const dummyUsers = [
  {
    username: 'daniel',
    email: 'daniel@gmail.com',
    firstName: 'daniel',
    lastName: 'daniel',
    password: 'holaquetal'
  },
  {
    username: 'ricardo',
    email: 'ricardo@gmail.com',
    firstName: 'ricardo',
    lastName: 'ricardo',
    password: 'quepaso'
  },
  {
    username: 'diego',
    email: 'diego@gmail.com',
    firstName: 'diego',
    lastName: 'diego',
    password: 'nomedigas'
  }
]

/**
 * Function to check that an user was created correctly after the registration process.
 *
 * @param {object} user
 * @param {function} done
 */
function userExistAndAttsAreCorrect(user, done) {
  User.query()
    .findOne({
      username: user.username
    })
    .then(foundUser => {
      expect(foundUser.username).toEqual(user.username)
      expect(foundUser.email).toEqual(user.email)

      const samePassword = comparePasswords(user.password, foundUser.password)

      expect(samePassword).toBeTruthy()
      done()
    })
    .catch(err => {
      done(err)
    })
}

/**
 * Function to check that an error is an UserInfoInUse instance.
 *
 * @param {object} error
 * @param {function} done
 */
function checkUserInfoInUseError(error, done) {
  expect(error.statusCode).toBe(409)
  expect(error.name).toEqual('UserInfoInUse')
  expect(typeof error.message).toBe('string')
  done()
}

/**
 * Function to check that an error is an InvalidCredentials instance.
 *
 * @param {object} error
 * @param {function} done
 */
function checkInvalidCredentialsError(error, done) {
  expect(error.statusCode).toBe(400)
  expect(error.name).toEqual('InvalidCredentials')
  expect(typeof error.message).toBe('string')
  done()
}

/**
 * Function to check that an error is an ValidationError instance.
 *
 * @param {object} error
 * @param {function} done
 */
function checkValidationError(error, done) {
  expect(error.statusCode).toBe(400)
  expect(error.name).toEqual('ValidationError')
  expect(typeof error.message).toBe('string')
  done()
}

describe('Users Routes', () => {
  beforeEach(done => {
    User.query()
      .delete()
      .then(() => done())
      .catch(err => done(err))
  })

  afterAll(async () => {
    try {
      await User.query().delete()
    } catch (error) {
      console.error('AfterAll Error', error)
    }

    server.close()
  })

  describe('POST /users/register', () => {
    test('An user that meets the conditions should be created.', done => {
      request(app)
        .post('/api/users/register')
        .send(dummyUsers[0])
        .end((_err, res) => {
          expect(res.status).toBe(201)
          userExistAndAttsAreCorrect(dummyUsers[0], done)
        })
    })

    test('Creating an user with an username that already exists should fail.', done => {
      Promise.all(dummyUsers.map(user => User.query().insert(user))).then(
        () => {
          request(app)
            .post('/api/users/register')
            .send({
              username: dummyUsers[0].username,
              email: 'danielnewemail@gmail.com',
              firstName: 'daniel',
              lastName: 'daniel',
              password: 'password123'
            })
            .end((_err, res) => {
              expect(res.status).toBe(409)
              checkUserInfoInUseError(res.body, done)
            })
        }
      )
    })

    test('Creating an user with an email that already exists should fail.', done => {
      Promise.all(dummyUsers.map(user => User.query().insert(user))).then(
        request(app)
          .post('/api/users/register')
          .send({
            username: 'newdaniel',
            email: dummyUsers[0].email,
            firstName: 'daniel',
            lastName: 'daniel',
            password: 'password123'
          })
          .end((_err, res) => {
            expect(res.status).toBe(409)
            checkUserInfoInUseError(res.body, done)
          })
      )
    })

    test('Creating an user without an username should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          firstName: 'luis',
          lastName: 'luis',
          password: 'password123'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user without a password should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          username: 'luisluis',
          firstName: 'luis',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user without an email should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          username: 'luisluis',
          password: 'password123',
          firstName: 'luis',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user without an firstName should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          username: 'luisluis',
          password: 'password123',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user without an lastName should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          username: 'luisluis',
          password: 'password123',
          firstName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user with an invalid email should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'gmail.com',
          username: 'luisluis',
          password: 'password123',
          firstName: 'luis',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user with an username with less than 3 chars should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          username: 'l',
          password: 'password123',
          firstName: 'luis',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user with an username with more than 30 chars should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          username: 'luis'.repeat(15),
          password: 'password123',
          firstName: 'luis',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user with a password with less than 6 chars should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          username: 'luis',
          password: 'abc',
          firstName: 'luis',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Creating an user with a password with more than 200 chars should fail.', done => {
      request(app)
        .post('/api/users/register')
        .send({
          email: 'luis@gmail.com',
          username: 'luis',
          password: 'password'.repeat(40),
          firstName: 'luis',
          lastName: 'luis'
        })
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('The username and email of a valid user should be stored in lowercase.', done => {
      const user = {
        email: 'LUIS@GMAIL.COM',
        username: 'LUIS',
        password: 'password',
        firstName: 'luis',
        lastName: 'luis'
      }

      request(app)
        .post('/api/users/register')
        .send(user)
        .end((_err, res) => {
          expect(res.status).toBe(201)
          expect(res.body.statusCode).toBe(201)
          expect(typeof res.body.message).toBe('string')
          expect(res.body.response).toBeInstanceOf(Object)
          userExistAndAttsAreCorrect(
            {
              username: user.username.toLowerCase(),
              email: user.email.toLowerCase(),
              password: user.password,
              firstName: user.firstName,
              lastName: user.lastName
            },
            done
          )
        })
    })
  })

  describe('POST users/login', () => {
    test("Login should fail if the user doesn't provide an username or email.", done => {
      const loginBody = {
        password: 'holaholahola'
      }

      request(app)
        .post('/api/users/login')
        .send(loginBody)
        .end((err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test("Login should fail if the user doesn't provide a password.", done => {
      const loginBody = {
        username: 'username'
      }

      request(app)
        .post('/api/users/login')
        .send(loginBody)
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Login should fail if the user provides email and username in the same request', done => {
      const loginBody = {
        email: 'legitemail@gmail.com',
        password: 'password123',
        username: 'username'
      }

      request(app)
        .post('/api/users/login')
        .send(loginBody)
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkValidationError(res.body, done)
        })
    })

    test('Login should fail if the user is not registered.', done => {
      const loginBody = {
        username: 'jose',
        password: 'holaholahola'
      }

      request(app)
        .post('/api/users/login')
        .send(loginBody)
        .end((_err, res) => {
          expect(res.status).toBe(400)
          checkInvalidCredentialsError(res.body, done)
        })
    })

    test('Login should fail for a registered user if he provides an incorrect password', done => {
      const newUser = {
        username: 'daniel',
        email: 'daniel@gmail.com',
        firstName: 'daniel',
        lastName: 'daniel',
        password: 'perrosamarillos'
      }

      User.query()
        .insert({ ...newUser, password: hashPasswordSync(newUser.password) })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({
              username: newUser.username,
              password: 'arrozverde'
            })
            .end((_err, res) => {
              expect(res.status).toBe(400)
              expect(typeof res.text).toBe('string')
              done()
            })
        })
        .catch(err => {
          done(err)
        })
    })

    test('A registered user should obtain a JWT after passing the login.', done => {
      const body = {
        username: 'daniel',
        email: 'daniel@gmail.com',
        firstName: 'daniel',
        lastName: 'daniel',
        password: 'perrosamarillos'
      }

      User.query()
        .insert({ ...body, password: hashPasswordSync(body.password) })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({
              username: body.username,
              password: body.password
            })
            .end((_err, res) => {
              expect(res.status).toBe(200)
              expect(typeof res.body.response.token).toEqual('string')
              done()
            })
        })
        .catch(err => {
          done(err)
        })
    })

    test("The capitalization shouldn't matter in the login", done => {
      const body = {
        username: 'daniel',
        firstName: 'daniel',
        lastName: 'daniel',
        email: 'daniel@gmail.com',
        password: 'perrosamarillos'
      }

      User.query()
        .insert({ ...body, password: hashPasswordSync(body.password) })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({
              username: 'DaNIEL',
              password: body.password
            })
            .end((_err, res) => {
              expect(res.status).toBe(200)
              expect(res.body.response.username).toEqual(body.username)
              expect(typeof res.body.response.token).toEqual('string')
              done()
            })
        })
        .catch(err => {
          done(err)
        })
    })
  })
})
