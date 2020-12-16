import Router from 'express-promise-router';
import * as authController from '../../../controllers/auth.controller';
const authRouter = Router();

// POST /api/auth
authRouter.post('/login', authController.validate('login'), authController.login);

// POST /api/auth/logout
authRouter.post('/logout', authController.logout);

// POST /api/auth/register
authRouter.post('/register', authController.validate('register'), authController.register);

export default authRouter;
