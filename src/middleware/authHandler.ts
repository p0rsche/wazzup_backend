import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_REFRESH_TOKEN_COOKIE_NAME } from '../helpers/constants';
import jwt_utils from '../helpers/jwt_utils';
import { error } from '../helpers/responses';
import { IExpressMiddlewareAsync } from '../helpers/types';

export const checkRefreshTokenValidity: IExpressMiddlewareAsync = async (req, res, next) => {
  //check HttpOnly cookie for refresh token
  const refreshToken = req.cookies[JWT_REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    res.json(error(403, 'No refresh token found'));
    return;
  }
  // check Refresh Token validity
  try {
    const { id } = await jwt_utils.verifyRefreshToken(refreshToken);
    res.locals.id = id;
  } catch (e) {
    res.json(error(403, 'Refresh token validation error'));
  }
  //all is great, proceeding next
  next();
};

export const checkAuthorization: IExpressMiddlewareAsync = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const token = authorization.split(' ').pop();
      const user = await jwt_utils.verifyAccessToken(token);
      req.user = user;
      next();
    } catch (e) {
      res.json(error(403, 'Token error'));
    }
  } else {
    res.json(error(403, 'Unauthorized'));
  }
};
