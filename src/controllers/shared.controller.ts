import { error, success } from '../helpers/responses';
import NotesService from '../services/notes.service';
import db from '../db';
import { IExpressMiddlewareAsync } from '../helpers/types';

export const go: IExpressMiddlewareAsync = async (req, res, next) => {
  try {
    const { link } = req.params;
    const note = await NotesService.getBySharedLink(db, link);
    if (!note) {
      res.json(error(404, 'No shared link found'));
      return;
    }
    res.json(success(200, { note }));
  } catch (e) {
    res.json(error(500, e.message));
  }
};
