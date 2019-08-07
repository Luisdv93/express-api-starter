import Knex from 'knex'
import { Model } from 'objection'
import knexFileConfig from './knexfile'

const knexConfig = Knex(knexFileConfig)

Model.knex(knexConfig)

export default knexConfig
