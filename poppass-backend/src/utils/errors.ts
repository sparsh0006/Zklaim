// Example - expand as needed
export class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Object.setPrototypeOf(this, ApiError.prototype);
    }
  }
  
  export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  }
  
  export class BadRequestError extends ApiError {
      constructor(message = 'Bad Request') {
          super(message, 400);
      }
  }
  // ... other error types