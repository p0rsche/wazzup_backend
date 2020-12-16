//json responsed according to JSEND format - https://github.com/omniti-labs/jsend

import { JSONResponse } from './types';

export const success = (statusCode = 200, data?: unknown): Partial<JSONResponse> => ({
  statusCode,
  status: 'success',
  data,
});

export const error = (statusCode: number, message: string, data?: unknown): Partial<JSONResponse> => ({
  statusCode,
  status: 'error',
  message,
  data,
});
