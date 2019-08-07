import request from 'supertest'
import { app, server } from '../index'

describe('Base API Test', () => {
  afterAll(() => {
    server.close()
  })

  it('should return API version and title for the app', done => {
    request(app)
      .get('/api')
      .end((err, res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body.app).toEqual(app.locals.title)
        expect(res.body.apiVersion).toEqual(app.locals.version)

        done()
      })
  })

  it('should return 404 route not found for random API hits', done => {
    const randomString = Math.random()
      .toString(36)
      .substr(2, 5)

    request(app)
      .get(`/api/${randomString}`)
      .end((err, res) => {
        expect(res.statusCode).toBe(404)
        expect(res.body.statusCode).toEqual(404)
        expect(res.body.message).toEqual(
          'Route not found, check for typos or method'
        )

        done()
      })
  })

  it('should return 200 and empty JSON message for an empty body', done => {
    request(app)
      .post('/api')
      .send({})
      .end((err, res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body.statusCode).toEqual(200)
        expect(res.body.message).toEqual('Empty JSON')

        done()
      })
  })
})
