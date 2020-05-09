import { HttpStatus } from '@nestjs/common';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomError } from '../errors/custom.error';
import { Reflector } from '@nestjs/core';
import * as META from '../constants/meta.constant';
import * as TEXT from '../constants/text.constant';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const target = context.getHandler();
    const message =
      this.reflector.get<string>(META.HTTP_ERROR_MESSAGE, target) ||
      TEXT.HTTP_ERROR_TEXT;
    const statusCode = this.reflector.get<HttpStatus>(
      META.HTTP_ERROR_CODE,
      target,
    );
    return next
      .handle()
      .pipe(
        catchError(error =>
          throwError(new CustomError({ message, error }, statusCode)),
        ),
      );
  }
}
