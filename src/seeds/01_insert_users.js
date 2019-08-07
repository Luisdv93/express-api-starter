const bcrypt = require('bcrypt')

/**
 * Delete all existing entries and seed users table.
 *
 * @param {object} knex
 * @param {object} Promise
 * @returns {Promise}
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'luisluis',
          email: 'luis@gmail.com',
          password: bcrypt.hashSync('password123', 10),
          firstName: 'luis',
          lastName: 'luis'
        },
        {
          username: 'danieldaniel',
          email: 'daniel@gmail.com',
          password: bcrypt.hashSync('password123', 10),
          firstName: 'daniel',
          lastName: 'daniel'
        }
      ])
    })
}
