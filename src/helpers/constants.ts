export const LOGIN_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 3;
export const JWT_ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; //in ms; 15 mins
export const JWT_REFRESH_TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; //in ms; 24hr/1d
export const JWT_REFRESH_TOKEN_COOKIE_NAME = 'rt';
export const REDIS_BLACKLIST_PREFIX = 'blocked:';
export const NOTES_PER_PAGE = 10;
export const NOTE_MAXLEN = 10000;
