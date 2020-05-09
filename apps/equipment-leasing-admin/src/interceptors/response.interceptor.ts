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
import { PaginateResult } from 'mongoose';

// 转换为标准的数据结构
export function transformDataToPaginate<T>(
  data: PaginateResult<T>,
  request?: any,
): HttpPaginateOption<T[]> {
  return {
    data: data.docs,
    paginateParams: request ? request.paginateParams : null,
    pagination: {
      total: data.total,
      currentPage: data.page,
      totalPage: data.pages,
      limit: data.limit,
    },
  };
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
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
      map(value => ({
        state: IHttpStatus.Success,
        message,
        data: usePaginate ? transformDataToPaginate(value, request) : value,
      })),
    );
  }
}
