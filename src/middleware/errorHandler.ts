import errors from '../helpers/errors';
import { error } from '../helpers/responses';

const { GeneralError } = errors;

const errorHandler = (err, res): void => {
  let code = 500;
  if (err instanceof GeneralError) {
    code = err.getCode();
  }

  res.json(error(code, err.message, { code }));
};

export default errorHandler;
