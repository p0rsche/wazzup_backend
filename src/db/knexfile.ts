import dotenv from 'dotenv';

dotenv.config();

const {
  NODE_ENV,
  KNEX_CLIENT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
} = process.env;

export default {
  development: {
    debug: NODE_ENV === 'development',
    client: KNEX_CLIENT ?? 'pg',
    connection: {
      database: DATABASE_NAME ?? 'notes',
      user: DATABASE_USER ?? 'notes_user',
      password: DATABASE_PASSWORD ?? '',
      host: DATABASE_HOST ?? 'localhost',
      port: parseInt(DATABASE_PORT) ?? 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    seeds: {
      directory: __dirname + '/seeds',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'notes_test',
      user: 'notes_user',
      password: '',
      host: 'localhost',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    seeds: {
      directory: __dirname + '/seeds',
    },
  },
};
