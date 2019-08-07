/**
 * Create users table.
 *
 * @param {object} knex
 * @returns {Promise}
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('username').notNullable()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()
    table.string('token').defaultTo(null)
    table.boolean('isVerified').defaultTo(false)
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

/**
 * Drop users table.
 *
 * @param {object} knex
 * @returns {Promise}
 */
exports.down = function(knex) {
  if (process.env.NODE_ENV !== 'production') {
    return knex.schema.dropTableIfExists('users')
  }
}
