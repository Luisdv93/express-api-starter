# Express API Starter

> Starter application for building APIs with Express.js

Comes with:

- [ES6](http://babeljs.io/learn-es2015/) features/modules
- ES7 [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)/[await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Objection](https://vincit.github.io/objection.js/) ORM and [Knex](http://knexjs.org/) migrations
- PostgreSQL (default) with support for MySQL and SQLite
- [ESLint](http://eslint.org/) for code linting
- Request validation using [Joi](https://www.npmjs.com/package/joi)
- Code formatting using [Prettier](https://www.npmjs.com/package/prettier)
- Configuration management using [dotenv](https://www.npmjs.com/package/dotenv)
- Logging using [winston](https://www.npmjs.com/package/winston)
- Tests using [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest)

---

## Prerequisites

- [Node.js](https://yarnpkg.com/en/docs/install)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [NPM](https://docs.npmjs.com/getting-started/installing-node)
- [PostgreSQL](https://www.postgresql.org/download/) / [MySQL](https://www.mysql.com/downloads/) / [SQLite](https://www.sqlite.org/download.html)

## Setup

Clone the repository, install the dependencies and get started right away.

    $ git clone https://github.com/Luisdv93/express-api-starter.git
    $ cd <express-api-starter>
    $ rm -rf .git
    $ yarn install or npm install

Make a copy of `.env.example` as `.env` and update your application details and database credentials. Now, run the migrations and seed the database.

    $ yarn migrate
    $ yarn seed

Finally, start the application.

    $ yarn start (For development)
    $ yarn prod (For production)

Navigate to http://localhost:8000 to verify the installation.

## Creating new Migrations and Seeds

These are the commands to create a new migration and corresponding seed file.

    $ yarn make:migration <name>
    $ yarn make:seeder <name>

Example,

    $ yarn make:migration create_tags_table
    $ yarn make:seeder 02_insert_tags

## Setup Using Docker

Use [docker-compose](https://docs.docker.com/compose/) to quickly bring up a stack with pre-configured Postgres database container. Data is ephemeral and containers will disappear when stack is removed.

Specific configuration for Docker is in `.env.docker`

- `0.0.0.0` as `$APP_HOST` to expose app on Docker network interface
- Pre-configured Postgres settings - can be updated to point to another Postgres host

Bring up stack,

    $ docker-compose up

Navigate to http://localhost:8848 to verify application is running from docker.

Bring down stack,

    $ docker-compose down

## Using MySQL instead of PostgreSQL

Install the [mysql](https://www.npmjs.com/package/mysql) driver first.

    $ yarn add mysql

Update these lines in your `.env` file.

```diff
- DB_CLIENT='pg'
+ DB_CLIENT='mysql'

- DB_PORT='5432'
+ DB_PORT='3306'
```

You can remove the [pg](https://www.npmjs.com/package/pg) driver if you like to.

    $ yarn remove pg

That's it, you are ready to roll.

## Tests

To run the tests you need to create a separate test database. Don't forget to update your `.env` file to include the connections for test database.

    $ NODE_ENV=test yarn migrate
    $ yarn test

Run tests with coverage.

    $ yarn test:coverage

## Contributing

For contribution and feature requests, please create an [issue](https://github.com/Luisdv93/express-api-starter/issues) first.

## License

express-api-starter is under [MIT License](LICENSE).
