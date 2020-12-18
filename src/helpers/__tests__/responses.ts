import { success, error } from '../responses';

describe('success response', () => {
  let successResponse;

  beforeEach(() => {
    successResponse = {
      statusCode: 200,
      status: 'success',
    };
  });

  test('called with default params', () => {
    expect(success()).toEqual(successResponse);
  });

  test('called with custom status code', () => {
    const response = success(204);
    successResponse.statusCode = 204;
    expect(response).toEqual(successResponse);
  });

  test('called with custom status and data', () => {
    const data = { test: 'field' };
    const response = success(204, data);
    successResponse.data = data;
    successResponse.statusCode = 204;
    expect(response).toEqual(successResponse);
  });
});

describe('error response', () => {
  let errorResponse;

  beforeEach(() => {
    errorResponse = {
      status: 'error',
    };
  });

  test('called with 403 and empty message', () => {
    errorResponse.statusCode = 403;
    errorResponse.message = '';
    expect(error(403, '')).toEqual(errorResponse);
  });

  test('called with 403 and custom message with data', () => {
    errorResponse.statusCode = 403;
    errorResponse.message = 'custom';
    errorResponse.data = { test: 'field' };
    expect(error(403, 'custom', { test: 'field' })).toEqual(errorResponse);
  });
});
