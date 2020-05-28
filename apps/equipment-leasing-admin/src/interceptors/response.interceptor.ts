import { HttpStatus } from '@nestjs/common';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as META from '../constants/meta.constant';
import * as TEXT from '../constants/text.constant';
import { IHttpStatus, HttpPaginateOption } from '../interfaces/http.interface';
import { OperationLog, OperationLogModel } from '../models/operation-log.model';
import { MongooseModel } from '../interfaces/mongoose.interface';

// 转换为标准的数据结构
export function transformDataToPaginate<T>(
  data: any,
  request?: any,
): HttpPaginateOption<T[]> {
  return {
    data: data.docs || data,
    paginateParams: request ? request.paginateParams : null,
    pagination: {
      total: data.totalDocs,
      currentPage: data.page,
      totalPage: data.totalPages,
      limit: data.limit,
    },
  };
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public operationLogModel: any = OperationLogModel;
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const target = context.getHandler();
    const request = context.switchToHttp().getRequest<Request>();
    const message =
      this.reflector.get<string>(META.HTTP_SUCCESS_MESSAGE, target) ||
      TEXT.HTTP_SUCCESS_TEXT;
    const statusCode =
      this.reflector.get<HttpStatus>(META.HTTP_SUCCESS_CODE, target) || 200;
    const usePaginate = this.reflector.get<boolean>(META.HTTP_PAGINATE, target);

    return next.handle().pipe(
      map(async value => {
        this.operationLogModel.create(this.recording(context, message));
        return {
          state: IHttpStatus.Success,
          message,
          data: usePaginate ? transformDataToPaginate(value, request) : value,
        };
      }),
    );
  }

  recording(context: ExecutionContext, message: string) {
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
    data.type = 0;
    data.stack = null;
    data.title = message;
    data.body = JSON.stringify(request.body);
    return data;
  }
}
