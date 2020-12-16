import { body, ValidationChain, validationResult } from 'express-validator';
import { NOTE_MAXLEN, NOTES_PER_PAGE } from '../helpers/constants';
import { error, success } from '../helpers/responses';
import NotesService from '../services/notes.service';
import db from '../db';
import { nanoid } from 'nanoid/async';
import { IExpressMiddlewareAsync } from '../helpers/types';

export const validate = (method: string): Array<ValidationChain> => {
  switch (method) {
    case 'createNote':
    case 'editNote': {
      return [body('text').exists().not().isEmpty().trim().escape().isLength({ max: NOTE_MAXLEN })];
    }
  }
};

export const getAllNotes: IExpressMiddlewareAsync = async (req, res, next) => {
  const user_id = req.user.id;
  let perPage = parseInt(req.query.perPage as string);
  let currentPage = parseInt(req.query.currentPage as string);
  if (!perPage) {
    perPage = NOTES_PER_PAGE;
  }
  if (!currentPage) {
    currentPage = 1;
  }
  const { data: notes, pagination } = await NotesService.getAll(db, user_id, {
    perPage,
    currentPage,
  });

  res.json(success(200, { notes, pagination }));
};

export const getNoteById: IExpressMiddlewareAsync = async (req, res, next) => {
  const note_id = parseInt(req.params.id);
  const note = await NotesService.getById(db, note_id);

  res.json(success(200, { note }));
};

export const createNote: IExpressMiddlewareAsync = async (req, res, next) => {
  const user_id = req.user.id;
  const { text } = req.body;
  const note_id = await NotesService.create(db, { user_id, text });

  res.json(success(200, { note_id }));
};

export const editNote: IExpressMiddlewareAsync = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(error(422, 'Validation error', { data: errors.array() }));
      return;
    }
    const note_id = parseInt(req.params.id);
    const { text } = req.body;
    await NotesService.updateText(db, note_id, text);

    res.json(success());
  } catch (e) {
    return next(e);
  }
};

export const deleteNote: IExpressMiddlewareAsync = async (req, res, next) => {
  const note_id = parseInt(req.params.id);
  const user_id = req.user.id;
  await NotesService.delete(db, user_id, note_id);

  res.json(success(204));
};

export const shareNote: IExpressMiddlewareAsync = async (req, res, next) => {
  const note_id = parseInt(req.params.note_id);
  const note = await NotesService.getById(db, note_id);
  if (note) {
    const link = await nanoid();
    const result = await NotesService.share(db, { note_id, link });
    res.json(success(200, { link: result }));
  } else {
    res.json(error(404, 'Note not found: ' + note_id));
  }
};

export const deleteSharedNote: IExpressMiddlewareAsync = async (req, res, next) => {
  const note_id = parseInt(req.params.note_id);
  const user_id = req.user.id;
  const note = await NotesService.getById(db, note_id);
  if (note.user_id === user_id) {
    await NotesService.deleteSharedNote(db, note_id);
    res.json(success());
  } else {
    res.json(error(403, 'You can delete only your shared links'));
  }
};
