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
import { OperationLog, OperationLogModel } from '../models/operation-log.model';
import { Request } from 'express';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  public operationLogModel: any = OperationLogModel;
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
    return next.handle().pipe(
      catchError(error => {
        this.operationLogModel.create(
          this.recording(context, message, error.stack || error),
        );
        return throwError(new CustomError({ message, error }, statusCode));
      }),
    );
  }

  recording(context: ExecutionContext, message: string, stack) {
    const data: OperationLog = {};
    const request: Request = context.switchToHttp().getRequest();
    const ip = ((request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request?.socket?.remoteAddress ||
      request.ip ||
      request.ips[0]) as string).replace('::ffff:', '');

    data.ip = ip;
    data.url = request.url;
    data.userId = (request?.user as any)?._id || null;
    data.method = request.method;
    data.controllerName = context.getClass().name;
    data.funcName = context.getHandler().name;
    data.type = 1;
    data.stack = stack;
    data.title = message;
    data.body = JSON.stringify(request.body);
    return data;
  }
}
