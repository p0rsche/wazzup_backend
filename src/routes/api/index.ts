import Router from 'express-promise-router';
import notesRouter from './v1/notes';
import authRouter from './v1/auth';
import tokenRouter from './v1/token';

const apiRouter = Router();

apiRouter.use('/notes', notesRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/token', tokenRouter);

export default apiRouter;
