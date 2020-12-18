import { NextFunction, Request, Response } from 'express';
import { checkRefreshTokenValidity, checkAuthorization } from '../authHandler';
import jwt_utils from '../../helpers/jwt_utils';
import { JWT_REFRESH_TOKEN_COOKIE_NAME } from '../../helpers/constants';

const payload = { id: 1, login: 'test' };

describe('Authorization middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  test('should fail if no auth header specified', async () => {
    const expectedResponse = {
      statusCode: 403,
      status: 'error',
      message: 'Unauthorized',
    };
    await checkAuthorization(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should fail with WRONG token', async () => {
    const expectedResponse = {
      statusCode: 403,
      status: 'error',
      message: 'Token error',
    };
    mockRequest = {
      headers: {
        authorization: 'Bearer soMeRaNdOmToKeN',
      },
    };
    await checkAuthorization(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should fail with OUTDATED token', async () => {
    const token = jwt_utils.generateAccessToken(payload, -1);
    const expectedResponse = {
      statusCode: 403,
      status: 'error',
      message: 'Token error',
    };
    mockRequest = {
      headers: {
        authorization: 'Bearer ' + token,
      },
    };
    await checkAuthorization(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should proceed next with the right token', async () => {
    const token = jwt_utils.generateAccessToken(payload);
    mockRequest = {
      headers: {
        authorization: 'Bearer ' + token,
      },
    };
    await checkAuthorization(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockRequest['user']).toBeDefined();
    expect(mockRequest['user']['id']).toEqual(payload.id);
    expect(mockRequest['user']['login']).toContain(payload.login);
    expect(nextFunction).toHaveBeenCalled();
  });
});

describe('Refresh Token validation middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  test('should fail if no refresh token in cookies specified', async () => {
    const expectedResponse = {
      statusCode: 403,
      status: 'error',
      message: 'No refresh token found',
    };
    await checkRefreshTokenValidity(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should fail with WRONG token', async () => {
    mockRequest = {
      cookies: {
        [JWT_REFRESH_TOKEN_COOKIE_NAME]: 'soMeRaNdOmToKeN',
      },
    };
    const expectedResponse = {
      statusCode: 403,
      status: 'error',
      message: 'Refresh token validation error',
    };
    await checkRefreshTokenValidity(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should fail with OUTDATED token', async () => {
    const payload = { id: 1 };
    const token = jwt_utils.generateRefreshToken(payload, -1);
    mockRequest = {
      cookies: {
        [JWT_REFRESH_TOKEN_COOKIE_NAME]: token,
      },
    };
    const expectedResponse = {
      statusCode: 403,
      status: 'error',
      message: 'Refresh token validation error',
    };
    await checkRefreshTokenValidity(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should proceed with the right token', async () => {
    const payload = { id: 1 };
    const token = jwt_utils.generateRefreshToken(payload);
    mockRequest = {
      cookies: {
        [JWT_REFRESH_TOKEN_COOKIE_NAME]: token,
      },
    };
    mockResponse = {
      locals: {},
    };
    await checkRefreshTokenValidity(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse['locals']['id']).toBeDefined();
    expect(mockResponse['locals']['id']).toEqual(payload.id);
    expect(nextFunction).toHaveBeenCalled();
  });
});
