import Knex from 'knex';
import { IWithPagination } from 'knex-paginate';
import { NoteModel, Paginator } from '../helpers/types';

const NotesService = {
  getAll(db: Knex, user_id: number, config: Paginator): Promise<IWithPagination<NoteModel>> {
    return db
      .select('*')
      .from('notes')
      .leftJoin('shared_notes', 'notes.id', 'shared_notes.note_id')
      .where('user_id', user_id)
      .paginate({ ...config, isLengthAware: true });
  },

  create(db: Knex, note: Partial<NoteModel>): Promise<Array<number>> {
    return db
      .insert(note)
      .into('notes')
      .returning('id')
      .then((rows) => rows[0]);
  },

  getById(db: Knex, id: number): Promise<NoteModel> {
    return db
      .select('*')
      .from('notes')
      .leftJoin('shared_notes', 'notes.id', 'shared_notes.note_id')
      .where('id', id)
      .first();
  },

  getBySharedLink(db: Knex, link: string): Promise<NoteModel | unknown[]> {
    return db
      .select('*')
      .from('notes')
      .join('shared_notes', 'notes.id', 'shared_notes.note_id')
      .join('users', 'notes.user_id', 'users.id')
      .where('shared_notes.link', link)
      .first();
  },

  share(db: Knex, { note_id, link }: { note_id: number; link: string }): Promise<string> {
    return db.insert({ note_id, link }).into('shared_notes').returning('link');
  },

  deleteSharedNote(db: Knex, note_id: number): Promise<void> {
    return db('shared_notes').where({ note_id }).delete();
  },

  delete(db: Knex, user_id: number, id: number): Promise<void> {
    return db('notes').where({ id, user_id }).delete();
  },

  updateText(db: Knex, id: number, text: string): Promise<void> {
    return db('notes').where({ id }).update({ text, updated_at: db.fn.now() });
  },

  update(db: Knex, id: number, data: Partial<NoteModel>): Promise<void> {
    return db('notes')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });
  },
};

export default NotesService;
