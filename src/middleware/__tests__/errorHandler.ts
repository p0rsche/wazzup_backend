import { Response } from 'express';
import errorHandler from '../errorHandler';
import errors from '../../helpers/errors';
const { BadRequest } = errors;

const payload = { id: 1, login: 'test' };

describe('Error handler middleware', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
    };
  });

  test('should raise default 500 error for unhandled errors', () => {
    const err = new Error('Test error');
    const expectedResponse = {
      statusCode: 500,
      status: 'error',
      message: 'Test error',
      data: {
        code: 500,
      },
    };
    errorHandler(err, mockResponse);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test('should raise custom error for unhandled errors', () => {
    const err = new BadRequest('Bad request');
    const expectedResponse = {
      statusCode: 400,
      status: 'error',
      message: 'Bad request',
      data: {
        code: 400,
      },
    };
    errorHandler(err, mockResponse);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
});
