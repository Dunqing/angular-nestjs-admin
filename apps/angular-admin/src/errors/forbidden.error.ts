import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
