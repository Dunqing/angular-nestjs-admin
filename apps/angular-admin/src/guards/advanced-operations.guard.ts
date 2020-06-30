import { AssigningMenus } from '../modules/model/role-menu.model';
import { DelUsers } from '../modules/user/user.model';
import { Identifier, NamePrefix } from '../interfaces/permission.interface';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  PERMISSION_IDENTIFIER,
  PERMISSION_NAME_PREFIX,
  SUPER_ADMIN_ID,
  SUPER_ROLE_ID,
} from '../constants/meta.constant';
import { DelRoles, AssigningRoles } from '../modules/role/role.model';
import { ForbiddenError } from '../errors/forbidden.error';

// 需要排查的标识符
const pIdentifier = {
  assignRole: `${NamePrefix.Role}_${Identifier.ASSIGN_ROLE}`,
  assignMenu: `${NamePrefix.Role}_${Identifier.ASSIGN_MENU}`,
  roleDel: `${NamePrefix.Role}_${Identifier.DEL}`,
  userDel: `${NamePrefix.User}_${Identifier.DEL}`,
  roleEdit: `${NamePrefix.Role}_${Identifier.EDIT}`,
  userEdit: `${NamePrefix.User}_${Identifier.EDIT}`,
};

@Injectable()
export class AdvancedOperationsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    type BodyType = DelUsers & DelRoles & AssigningMenus & AssigningRoles;
    const request = context.switchToHttp().getRequest<Request>();
    const user: any = request.user;
    const userId = user._id.toString();
    const body: BodyType = request.body;

    const identifier = this.reflector.get<string>(
      PERMISSION_IDENTIFIER,
      context.getHandler(),
    );
    const prefix = this.reflector.get<string>(
      PERMISSION_NAME_PREFIX,
      context.getClass(),
    );
    const permissionIdentifier = `${prefix}_${identifier}`;

    const userIds = [];
    const roleIds = [];

    if (!user.superAdmin) {
      if (
        pIdentifier.assignRole === permissionIdentifier &&
        userId === body.userId
      ) {
        throw new ForbiddenError('不可以更改自己的角色');
      }
      return true;
    } else {
      if (pIdentifier.assignRole === permissionIdentifier) {
        userIds.push(body.userId);
      } else if (pIdentifier.assignMenu === permissionIdentifier) {
        roleIds.push(body.roleId);
      } else if (pIdentifier.roleDel === permissionIdentifier) {
        if (body.roleIds) {
          roleIds.push(...body.roleIds);
        }
      } else if (pIdentifier.userDel === permissionIdentifier) {
        if (body.userIds) {
          userIds.push(...body.userIds);
        }
      }
      if (userIds.includes(SUPER_ADMIN_ID) || roleIds.includes(SUPER_ROLE_ID)) {
        throw new ForbiddenError('请不要乱动，伟大的超级管理员!');
      }
      return true;
    }
  }
}
