import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { redis } from '../db';

import { JWT_ACCESS_TOKEN_EXPIRATION, JWT_REFRESH_TOKEN_EXPIRATION, REDIS_BLACKLIST_PREFIX } from './constants';
import { UserModelJWT } from './types';

dotenv.config();

const accessTokenSecret = process.env.JWT_SECRET ?? 'CHANGE_JWT_SECRET';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET ?? 'CHANGE_REFRESH_JWT_SECRET';

const verifyToken = (token: string, secret: string): Promise<UserModelJWT> | never => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decode: UserModelJWT) => {
      if (err) {
        reject(err);
      } else {
        resolve(decode);
      }
    });
  });
};

export default {
  verifyRefreshToken(token: string): Promise<UserModelJWT> | never {
    return verifyToken(token, refreshTokenSecret);
  },
  verifyAccessToken(token: string): Promise<UserModelJWT> | never {
    return verifyToken(token, accessTokenSecret);
  },
  generateAccessToken(
    payload: Partial<UserModelJWT>,
    expiresIn: string | number = JWT_ACCESS_TOKEN_EXPIRATION + 'ms'
  ): string {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn,
    });
    return accessToken;
  },
  generateRefreshToken(
    payload: Partial<UserModelJWT>,
    expiresIn: string | number = JWT_REFRESH_TOKEN_EXPIRATION + 'ms'
  ): string {
    const refreshToken = jwt.sign({ id: payload.id }, refreshTokenSecret, {
      expiresIn,
    });
    return refreshToken;
  },
  generateTokens(payload: UserModelJWT): [string, string] {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return [accessToken, refreshToken];
  },
  addTokenToBlacklist(token: string, expires = JWT_REFRESH_TOKEN_EXPIRATION): Promise<'OK' | null> {
    // 'PX' - expire in ms
    return redis.set(REDIS_BLACKLIST_PREFIX + token, '', 'PX', expires);
  },
  removeTokenFromBlacklist(token: string): Promise<unknown> {
    return redis.del(REDIS_BLACKLIST_PREFIX + token);
  },
  async checkIfTokenBlacklisted(token: string): Promise<boolean> {
    const result = redis.exists(REDIS_BLACKLIST_PREFIX + token);
    return Boolean(result);
  },
};
