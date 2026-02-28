/**
 * Custom Error Classes for Admin API
 *
 * @description
 * - All error types that may be thrown by admin services
 * - Type-safe error handling in controllers
 * - Prevents string-matching error handling
 */

/**
 * User already exists error
 *
 * Thrown when attempting to create a user with an email that already exists.
 */
export class UserAlreadyExistsError extends Error {
  name = 'UserAlreadyExistsError';
  statusCode = 409;

  constructor(message: string = 'User already exists') {
    super(message);
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}

/**
 * User not found error
 *
 * Thrown when attempting to access or modify a user that does not exist.
 */
export class UserNotFoundError extends Error {
  name = 'UserNotFoundError';
  statusCode = 404;

  constructor(message: string = 'User not found') {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

/**
 * Group not found error
 *
 * Thrown when attempting to access or modify a group that does not exist.
 */
export class GroupNotFoundError extends Error {
  name = 'GroupNotFoundError';
  statusCode = 404;

  constructor(message: string = 'Group not found') {
    super(message);
    Object.setPrototypeOf(this, GroupNotFoundError.prototype);
  }
}

/**
 * Nation not found error
 *
 * Thrown when attempting to access or modify a nation that does not exist.
 */
export class NationNotFoundError extends Error {
  name = 'NationNotFoundError';
  statusCode = 404;

  constructor(message: string = 'Nation not found') {
    super(message);
    Object.setPrototypeOf(this, NationNotFoundError.prototype);
  }
}

/**
 * Validation error
 *
 * Thrown when input validation fails in service layer.
 */
export class ValidationError extends Error {
  name = 'ValidationError';
  statusCode = 400;

  constructor(message: string = 'Invalid input') {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Permission denied error
 *
 * Thrown when the user lacks permission for the requested action.
 */
export class PermissionDeniedError extends Error {
  name = 'PermissionDeniedError';
  statusCode = 403;

  constructor(message: string = 'Permission denied') {
    super(message);
    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}

/**
 * Type guard to check if error has statusCode property
 */
export function isHttpError(error: unknown): error is Error & { statusCode: number } {
  return (
    error instanceof Error &&
    'statusCode' in error &&
    typeof (error as any).statusCode === 'number'
  );
}
