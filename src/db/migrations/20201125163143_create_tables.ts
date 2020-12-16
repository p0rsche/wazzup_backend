import * as Knex from 'knex';
import { NOTE_MAXLEN } from '../../helpers/constants';

const BCRYPT_HASH_LENGTH = 60;
const defaultAvatar =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('login', 50).notNullable();
      table.specificType('digest', `character varying(${BCRYPT_HASH_LENGTH})`).notNullable();
      table.string('fullname', 100);
      table.string('email', 100);
      table.string('avatar').defaultTo(defaultAvatar); //max 255 chars
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('notes', function (table) {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
      table.specificType('text', `character varying(${NOTE_MAXLEN})`).notNullable();
      table.timestamps(true, true);
    })
    .createTable('shared_notes', function (table) {
      table.integer('note_id').unique().references('id').inTable('notes').onDelete('CASCADE');
      table.string('link').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('shared_notes').dropTable('notes').dropTable('users');
}
