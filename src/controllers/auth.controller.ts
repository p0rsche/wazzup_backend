import { NextFunction, Request, Response } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import db from '../db';
import jwt_utils from '../helpers/jwt_utils';
import UserService from '../services/user.service';
import { error, success } from '../helpers/responses';
import {
  JWT_REFRESH_TOKEN_COOKIE_NAME,
  JWT_REFRESH_TOKEN_EXPIRATION,
  JWT_ACCESS_TOKEN_EXPIRATION,
  LOGIN_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../helpers/constants';
import { IExpressMiddlewareAsync, UserModel } from '../helpers/types';

export const validate = (method: string): Array<ValidationChain> => {
  switch (method) {
    case 'login':
    case 'register': {
      return [
        body('login').not().isEmpty().trim().escape().isLength({ min: LOGIN_MIN_LENGTH }),
        body('password').not().isEmpty().trim().escape().isLength({ min: PASSWORD_MIN_LENGTH }),
      ];
    }
  }
};

export const login: IExpressMiddlewareAsync = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(error(422, 'Validation error', { data: errors.array() }));
      return;
    }
    const { login, password } = req.body;
    const user: UserModel = await UserService.find(db, { login });
    if (!user) {
      res.json(error(401, 'Username or password incorrect'));
    } else {
      const isAuthenticated = await bcrypt.compare(password, user.digest);
      if (!isAuthenticated) {
        res.json(error(401, 'Username or password incorrect'));
      } else {
        delete user.digest;
        const [accessToken, refreshToken] = jwt_utils.generateTokens(user);

        res
          .cookie(JWT_REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION),
            httpOnly: true,
            sameSite: 'strict',
          })
          .json(
            success(200, {
              user,
              accessToken,
              expiresIn: JWT_ACCESS_TOKEN_EXPIRATION + 'ms',
            })
          );
      }
    }
  } catch (e) {
    return next(e);
  }
};

export const register: IExpressMiddlewareAsync = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json(error(422, 'Validation error', { data: errors.array() }));
    return;
  }
  const { login, password } = req.body;
  const user = await UserService.find(db, { login });
  if (user) {
    res.json(error(401, 'Login already registered'));
    return;
  }
  const digest = await bcrypt.hash(password, 10);
  const createdUser = await UserService.insertUser(db, { login, digest });

  const [accessToken, refreshToken] = jwt_utils.generateTokens(createdUser);

  res
    .cookie(JWT_REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION),
      httpOnly: true,
      sameSite: 'strict',
    })
    .json(
      success(200, {
        user: createdUser,
        accessToken,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION + 'ms',
      })
    );
};

export const logout: IExpressMiddlewareAsync = async (req, res, next) => {
  res.clearCookie(JWT_REFRESH_TOKEN_COOKIE_NAME).json(success());
};
