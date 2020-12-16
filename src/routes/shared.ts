import Router from 'express-promise-router';
import * as sharedController from '../controllers/shared.controller';

const sharedLinkRouter = Router();

sharedLinkRouter.get('/:link', sharedController.go);

export default sharedLinkRouter;
