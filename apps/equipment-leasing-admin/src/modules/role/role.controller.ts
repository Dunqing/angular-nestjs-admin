import {
  Controller,
  Post,
  Body,
  Put,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AssigningRoles, Role } from './role.model';
import { AssigningMenus } from '../model/role-menu.model';

@ApiTags('roles')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  create(@Body() data: Role): Promise<Role> {
    return this.roleService.createRole(data);
  }

  @Get('list')
  roleList(): Promise<Role> {
    return this.roleService.roleList();
  }

  @Put()
  updateRole(@Body() data: Role): Promise<Role> {
    if (!data.id) {
      throw new BadRequestException();
    }
    return this.roleService.updateRole(data.id, data);
  }

  @Put('assigningRoles')
  assigningRoles(@Body() data: AssigningRoles) {
    return this.roleService.assigningRoles(data);
  }

  @Put('assigningMenus')
  assigningMenus(@Body() data: AssigningMenus) {
    return this.roleService.assigningMenus(data);
  }
}
