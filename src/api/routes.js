import { Router } from 'express'
import usersRoutes from './users/users.routes'

const router = Router()

/**
 * GET /api
 */
router.get('/', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  })
})

router.use('/users', usersRoutes)

/**
 * Handle any route that's not defined
 */
router.use('*', (req, res, next) => {
  if (!req.route) {
    res.status(404).json({
      statusCode: 404,
      message: 'Route not found, check for typos or method'
    })

    return
  }

  next()
})

export default router
