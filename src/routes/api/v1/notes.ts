import Router from 'express-promise-router';
import * as notesController from '../../../controllers/notes.controller';
import { checkAuthorization } from '../../../middleware/authHandler';

const notesRouter = Router();

notesRouter.use(checkAuthorization);

// GET /api/notes
notesRouter.get('/', notesController.getAllNotes);

// POST /api/notes
notesRouter.post('/', notesController.validate('createNote'), notesController.createNote);
// GET /api/notes/:id
notesRouter.get('/:id', notesController.getNoteById);

// PATCH /api/notes/:id
notesRouter.patch('/:id', notesController.validate('editNote'), notesController.editNote);

// DELETE /api/notes/:id
notesRouter.delete('/:id', notesController.deleteNote);

// POST /api/notes/:id/share
notesRouter.post('/:note_id/share', notesController.shareNote);

// DELETE /api/notes/:id/share
notesRouter.delete('/:note_id/share', notesController.deleteSharedNote);

export default notesRouter;
