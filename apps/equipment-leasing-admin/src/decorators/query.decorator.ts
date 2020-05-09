import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { page = 1, limit = 10 } = request.params;
    const options = { page, limit };
    request['paginateParams'] = options;
    return options;
  },
);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getResponse();
    if (data) {
      return request.req.user[data];
    } else {
      return request.req.user;
    }
  },
);
