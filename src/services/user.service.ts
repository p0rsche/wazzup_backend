import Knex from 'knex';
import { UserModel, UserModelJWT } from '../helpers/types';

const UserService = {
  insertUser(db: Knex, { login, digest }: Partial<UserModel>): Promise<UserModelJWT> {
    return db
      .insert({ login, digest })
      .into('users')
      .returning(['id', 'login', 'fullname', 'email', 'avatar'])
      .then((rows) => rows[0]);
  },

  getAll(db: Knex): Promise<Array<UserModel>> {
    return db
      .select('*')
      .from('users')
      .then((rows) => rows);
  },

  find(db: Knex, credentials: Partial<UserModel>): Promise<UserModel> {
    return db('users').where(credentials).first();
  },

  findById(db: Knex, id: number): Promise<UserModel> {
    return db('users').select(['id', 'login', 'fullname', 'email', 'avatar']).where('id', id).first();
  },
};

export default UserService;
