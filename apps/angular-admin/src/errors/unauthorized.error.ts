import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
