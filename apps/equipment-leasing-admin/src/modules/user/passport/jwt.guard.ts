import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express' 
import { Reflector } from '@nestjs/core';
import { PERMISSION_IDENTIFIER, PERMISSION_NAME_PREFIX } from '../../../constants/meta.constant';
import { UnauthorizedError } from 'apps/equipment-leasing-admin/src/errors/unauthorized.error';
import { ForbiddenError } from '../../../errors/forbidden.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // return request.user
    return super.canActivate(context);
    // return true
  }

  handleRequest(err, user, info, context) {
    if (err || info) {
      throw err || new UnauthorizedError(info?.message)
    }
    
    const identifier = this.reflector.get<string>(PERMISSION_IDENTIFIER, context.getHandler());
    const prefix = this.reflector.get<string>(PERMISSION_NAME_PREFIX, context.getClass());
    const permissionIdentifier = `${prefix}_${identifier}`
    const plList = user.permissionIdentifierList
    
    console.log(permissionIdentifier, context.getHandler().name)
    // You can throw an exception based on either "info" or "err" arguments
    if (!identifier) {
      return user
    } else {
      if (plList.includes(permissionIdentifier) || user.superAdmin) {
        return user
      } else {
        throw new ForbiddenError('你没有此权限')
      }
      // throw err || new UnauthorizedError(info?.message)
    }
  }
}
