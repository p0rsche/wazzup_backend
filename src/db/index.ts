import knex from 'knex';
import Redis from 'ioredis';
import { attachPaginate } from 'knex-paginate';
import environments from './knexfile';
import dotenv from 'dotenv';

// expose env variables from .env file
dotenv.config();

export const getDatabaseURL = (): string => {
  const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

  return `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
};

const environment = process.env.NODE_ENV ?? 'development';

const config = environments[environment];

export const redis = new Redis();

const db = knex(config);
attachPaginate();

export default db;
