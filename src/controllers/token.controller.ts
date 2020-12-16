import jwt_utils from '../helpers/jwt_utils';
import { error, success } from '../helpers/responses';
import {
  JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_COOKIE_NAME,
  JWT_REFRESH_TOKEN_EXPIRATION,
} from '../helpers/constants';
import { IExpressMiddlewareAsync, UserModel } from '../helpers/types';
import UserService from '../services/user.service';
import db from '../db';

export const refreshToken: IExpressMiddlewareAsync = async (req, res, next) => {
  // validity already checked by middleware  // check if token not in blacklist
  const refreshToken = req.cookies[JWT_REFRESH_TOKEN_COOKIE_NAME];
  const isTokenBlacklisted = await jwt_utils.checkIfTokenBlacklisted(refreshToken);
  if (!isTokenBlacklisted) {
    res.json(error(403, 'Refresh Token invalidated'));
    return;
  }
  try {
    const { id } = res.locals;
    if (!id) throw new Error("Can't find id in refresh token");
    const user: UserModel = await UserService.findById(db, id);
    if (!user) {
      res.json(error(404, 'User not found'));
      return;
    }

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
  } catch (e) {
    res.json(error(403, 'Error while refreshing token', { data: e }));
  }
};

export const invalidateToken: IExpressMiddlewareAsync = async (req, res, next) => {
  const refreshToken = req.cookies[JWT_REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    res.json(error(401, 'No refresh token found'));
    return;
  }
  const result = await jwt_utils.addTokenToBlacklist(refreshToken);
  if (result !== 'OK') {
    res.json(error(500, 'Error while invalidating token'));
    return;
  }
  res.clearCookie(JWT_REFRESH_TOKEN_COOKIE_NAME).json(success());
};
