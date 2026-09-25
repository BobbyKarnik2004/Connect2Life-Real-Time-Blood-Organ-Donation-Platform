import httpStatus from 'http-status';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  let { statusCode, message } = err;
  
  if (!statusCode || !httpStatus[statusCode]) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }
  
  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  
  res.status(statusCode).json(response);
};
