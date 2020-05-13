import {
  Controller,
  Post,
  Body,
  Put,
  BadRequestException,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AssigningRoles, Role, DelRoles } from './role.model';
import { AssigningMenus } from '../model/role-menu.model';
import { HttpProcessor } from '../../decorators/http.decorator';
import { Paginate, UserInfo } from '../../decorators/query.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user/passport/jwt.guard';
import { UserService } from '../user/user.service';
import { PermissionIdentifier, PermissionNamePrefix } from '../../decorators/permission.decorator';
import { Identifier, NamePrefix } from '../../interfaces/permission.interface';
import { AdminGuards } from '../../guards/admin.guard';
import { QueryParams } from '../../decorators/query-params.decorator';


@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@PermissionNamePrefix(NamePrefix.Role)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private userService: UserService
    ) {}

  @PermissionIdentifier(Identifier.ADD)
  @Post()
  create(@Body() data: Role, @UserInfo() userInfo): Promise<Role> {
    return this.roleService.createRole(userInfo._id, data);
  }

  @PermissionIdentifier(Identifier.READ)
  @Get()
  @HttpProcessor.handle({ usePaginate: true, message: '获取角色列表' })
  async paginateList(@Paginate() options, @UserInfo() userInfo): Promise<Role> {
    const childrenIds = await this.userService.getUserChildrenId(userInfo._id)
    const querys = [
      { $match: { creatorId: { $in: childrenIds }}}
    ]
    return this.roleService.paginateList(querys, options);
  }

  @PermissionIdentifier(Identifier.READ)
  @Get('list')
  async roleList(@UserInfo() userInfo): Promise<Role> {
    const childrenIds = await this.userService.getUserChildrenId(userInfo._id, true)
    return this.roleService.roleList(childrenIds);
  }

  @UseGuards(AdminGuards)
  @PermissionIdentifier(Identifier.DEL)
  @Delete()
  delRole(@Body() body: DelRoles): Promise<Role> {
    return this.roleService.delRole(body.roleIds)
  }

  @PermissionIdentifier(Identifier.EDIT)
  @Put(':id')
  updateRole(@QueryParams() { params }, @Body() body: Role): Promise<Role> {
    console.log(params.id)
    return this.roleService.updateRole(params.id, body);
  }

  @UseGuards(AdminGuards)
  @PermissionIdentifier(Identifier.ASSIGN_ROLE)
  @Patch('assigningRoles')
  assigningRoles(@Body() data: AssigningRoles) {
    return this.roleService.assigningRoles(data);
  }
  
  @UseGuards(AdminGuards)
  @Patch('assigningMenus')
  @PermissionIdentifier(Identifier.ASSIGN_MENU)
  assigningMenus(@Body() data: AssigningMenus) {
    return this.roleService.assigningMenus(data);
  }
}
