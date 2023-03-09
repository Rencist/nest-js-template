import { HttpException, HttpStatus } from '@nestjs/common';

class ThereIsAnErrorException extends Error {
  message = '';
  statusCode;
  constructor(message, statusCode?) {
    super();
    this.message = message;
    if (statusCode) this.statusCode = statusCode;
  }
}

class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden Access', HttpStatus.FORBIDDEN);
    this.message = 'Forbidden Access';
  }
}

class FieldExistException extends HttpException {
  constructor() {
    super('Field Exist', HttpStatus.BAD_REQUEST);
    this.message = 'Field already exist';
  }
}

class UserNotFoundExecption extends HttpException {
  constructor() {
    super('Not Found', HttpStatus.BAD_REQUEST);
    this.message = 'User not found';
  }
}

class FieldEmptyException extends HttpException {
  constructor() {
    super('Field Empty', HttpStatus.BAD_REQUEST);
    this.message = 'A field is empty';
  }
}

class UnknownErrorException extends HttpException {
  constructor() {
    super('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
    this.message = 'Unknown error has occured';
  }
}

export {
  ThereIsAnErrorException,
  ForbiddenException,
  FieldExistException,
  FieldEmptyException,
  UnknownErrorException,
  UserNotFoundExecption,
};
