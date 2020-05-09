import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpErrorOption, IHttpStatus } from '../interfaces/http.interface';
import { Request, Response } from 'express';
import { isString } from 'lodash';

@Catch(HttpException)
export class ErrorExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorOption: HttpErrorOption = exception.getResponse() as HttpErrorOption;
    const errMessage = errorOption.message;
    const hasError = isString(errorOption.error) ? null : errorOption.error;
    const statusCode: HttpStatus = hasError
      ? (errorOption.error && errorOption.error.status) || status
      : status;
    const error = hasError
      ? errorOption.error
        ? errorOption.error.message || ''
        : null
      : errorOption.error || errorOption.message;

    const data = {
      state: IHttpStatus.Error,
      errMessage,
      error,
      debug: exception.stack,
    };

    if (statusCode === HttpStatus.NOT_FOUND) {
      data.errMessage = '找不到资源';
      data.error = `${request.method} -> ${request.url} 找不到`;
    }
    response.status(statusCode).jsonp(data);
  }
}
