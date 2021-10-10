import { StatusCodes } from 'http-status-codes';
import ErrorCodes from './ErrorCodes';
import ErrorBase from './ErrorBase';

const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handling of body-parser content malformed error
  if (err.type === 'entity.parse.failed') {
    return res.status(StatusCodes.BAD_REQUEST).send({
      errorCode: ErrorCodes.MALFORMED_JSON_ERROR_CODE,
      message: 'Malformed json'
    });
  }

  if (err instanceof ErrorBase) {
    const error = err;

    return res.status(error.getHttpStatusCode()).send({
      errorCode: error.getErrorCode(),
      message: error.getMessage()
    });
  } else if (err && err.error && err.error.isJoi) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      errorCode: ErrorCodes.VALIDATION_ERROR,
      message: err.error.toString(),
      type: err.type
    });
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      errorCode: ErrorCodes.RUNTIME_ERROR_CODE,
      message: 'Internal Server Error'
    });
  }
}

export default globalErrorHandler;
