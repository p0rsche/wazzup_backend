import Router from 'express-promise-router';
import * as tokenController from '../../../controllers/token.controller';
import { checkRefreshTokenValidity } from '../../../middleware/authHandler';

const tokenRouter = Router();

tokenRouter.use(checkRefreshTokenValidity);

// POST /api/token/refresh
tokenRouter.post('/refresh', tokenController.refreshToken);

// POST /api/token/invalidate
tokenRouter.post('/invalidate', tokenController.invalidateToken);

export default tokenRouter;
