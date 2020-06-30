import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpErrorOption } from '../interfaces/http.interface';

export class CustomError extends HttpException {
  constructor(options: HttpErrorOption, statusCode: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
