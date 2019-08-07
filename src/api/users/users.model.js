import { Model } from 'objection'

/**
 * User Model
 * @class User
 * @extends {Model}
 */
class User extends Model {
  /**
   * Get the table name.
   *
   * @readonly
   * @static
   * @memberof User
   */
  static get tableName() {
    return 'users'
  }

  /**
   * Get the id column.
   *
   * @readonly
   * @static
   * @memberof User
   */
  static get idColumn() {
    return 'id'
  }

  /**
   * Describe the json schema to validate the Model.
   *
   * @readonly
   * @static
   * @memberof User
   */
  static get jsonSchema() {
    return {
      type: 'object',

      required: ['username', 'email', 'password', 'firstName', 'lastName'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 3, maxLength: 30 },
        email: { type: 'string', maxLength: 255 },
        password: { type: 'string', minLength: 1 },
        firstName: { type: 'string', minLength: 2, maxLength: 30 },
        lastName: { type: 'string', minLength: 2, maxLength: 30 }
      }
    }
  }
}

export default User
