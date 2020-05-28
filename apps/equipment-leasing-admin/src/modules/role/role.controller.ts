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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AssigningRoles, Role, DelRoles } from './role.model';
import { AssigningMenus } from '../model/role-menu.model';
import { HttpProcessor, handle } from '../../decorators/http.decorator';
import { Paginate, UserInfo } from '../../decorators/query.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user/passport/jwt.guard';
import { UserService } from '../user/user.service';
import {
  PermissionIdentifier,
  PermissionNamePrefix,
} from '../../decorators/permission.decorator';
import { Identifier, NamePrefix } from '../../interfaces/permission.interface';
import { AdvancedOperationsGuard } from '../../guards/advanced-operations.guard';
import { QueryParams } from '../../decorators/query-params.decorator';

@ApiTags('role')
@ApiBearerAuth()
@Controller('role')
@UseGuards(JwtAuthGuard)
@PermissionNamePrefix(NamePrefix.Role)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private userService: UserService,
  ) {}

  @HttpProcessor.handle({ message: '创建角色' })
  @PermissionIdentifier(Identifier.ADD)
  @Post()
  create(@Body() data: Role, @UserInfo() userInfo): Promise<Role> {
    return this.roleService.createRole(userInfo._id, data);
  }

  @PermissionIdentifier(Identifier.READ)
  @Get('pagination')
  @HttpProcessor.handle({ usePaginate: true, message: '获取角色列表' })
  async paginateList(@QueryParams() { userInfo, options }): Promise<Role> {
    const childrenIds = await this.userService.getUserChildrenId(userInfo._id);
    const querys = [{ $match: { creatorId: { $in: childrenIds } } }];
    return this.roleService.paginateList(querys, options);
  }

  @PermissionIdentifier(Identifier.READ)
  @Get('list')
  async roleList(@UserInfo() userInfo): Promise<Role> {
    const childrenIds = await this.userService.getUserChildrenId(
      userInfo._id,
      true,
    );
    return this.roleService.roleList(childrenIds);
  }

  @HttpProcessor.handle({ message: '角色删除' })
  @UseGuards(AdvancedOperationsGuard)
  @PermissionIdentifier(Identifier.DEL)
  @Delete()
  async delRole(
    @QueryParams() { userInfo },
    @Body() body: DelRoles,
  ): Promise<Role> {
    const useDelIds = await this.userService.getUserChildrenId(
      userInfo._id,
      true,
    );
    return this.roleService.delRole(useDelIds, body.roleIds);
  }

  @HttpProcessor.handle({ message: '角色修改' })
  @PermissionIdentifier(Identifier.EDIT)
  @Put(':id')
  async updateRole(
    @QueryParams() { params, userInfo },
    @Body() body: Role,
  ): Promise<Role> {
    const useEditId = await this.userService.getUserChildrenId(
      userInfo._id,
      true,
    );
    return this.roleService.updateRole(useEditId, params.id, body);
  }

  @HttpProcessor.handle({ message: '分配角色' })
  @UseGuards(AdvancedOperationsGuard)
  @PermissionIdentifier(Identifier.ASSIGN_ROLE)
  @Patch('assigningRoles')
  async assigningRoles(
    @QueryParams() { userInfo },
    @Body() data: AssigningRoles,
  ) {
    const useAssignIds = await this.userService.getUserChildrenId(
      userInfo._id,
      true,
    );
    const canAssign = useAssignIds.find(id => id.equals(userInfo._id));
    if (canAssign) {
      return this.roleService.assigningRoles(userInfo._id, data);
    }
  }

  @HttpProcessor.handle({ message: '分配菜单' })
  @UseGuards(AdvancedOperationsGuard)
  @Patch('assigningMenus')
  @PermissionIdentifier(Identifier.ASSIGN_MENU)
  async assigningMenus(
    @QueryParams() { userInfo },
    @Body() data: AssigningMenus,
  ) {
    const useAssignIds = await this.userService.getUserChildrenId(
      userInfo._id,
      true,
    );
    return this.roleService.assigningMenus(useAssignIds, data);
  }
}
