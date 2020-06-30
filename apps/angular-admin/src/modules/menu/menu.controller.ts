import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { Menu, DelMenus } from './menu.model';
import { MenuService } from './menu.service';
import { Paginate, UserInfo } from '../../decorators/query.decorator';
import { HttpProcessor } from '../../decorators/http.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/passport/jwt.guard';
import {
  PermissionIdentifier,
  PermissionNamePrefix,
} from '../../decorators/permission.decorator';
import { Identifier, NamePrefix } from '../../interfaces/permission.interface';
import { QueryParams, IQueryParamsResult } from '../../decorators/query-params.decorator';
import { UserService } from '../user/user.service';

@UseGuards(JwtAuthGuard)
@PermissionNamePrefix(NamePrefix.Menu)
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService, private userSerivce: UserService) {}

  @PermissionIdentifier(Identifier.ADD)
  @Post()
  @HttpProcessor.handle('创建菜单')
  create(@UserInfo() user: any, @Body() data: Menu): Promise<Menu> {
    return this.menuService.createMenu(user._id, data);
  }

  @Get('merge')
  @PermissionIdentifier(Identifier.READ)
  mergeMenu(): Promise<Menu[]> {
    return this.menuService.getMergeMenu();
  }

  @Get('currentUser/merge/:id')
  @PermissionIdentifier(Identifier.READ)
  async userMergeMenuById(@QueryParams() { params, userInfo }: IQueryParamsResult): Promise<Menu[]> {
    const menus = await this.userSerivce.getCurrentUserMenus(userInfo)
    return this.menuService.getMergeMenu(params.id as any, menus, false)
  }

  @Get('merge/:id')
  @PermissionIdentifier(Identifier.READ)
  mergeMenuById(@Param('id') _id: string): Promise<Menu[]> {
    return this.menuService.getMergeMenu(_id);
  }

  @HttpProcessor.handle('删除菜单')
  @PermissionIdentifier(Identifier.DEL)
  @Delete()
  deleteMenu(@Body() body: DelMenus): Promise<Menu> {
    return this.menuService.deleteMenu(body.menuIds);
  }

  @PermissionIdentifier(Identifier.EDIT)
  @HttpProcessor.handle('修改菜单')
  @Put(':id')
  updateMenu(@QueryParams() { params }, @Body() body: Menu): Promise<Menu> {
    return this.menuService.updateMenu(params.id, body);
  }

  @HttpProcessor.handle('获取菜单列表')
  @PermissionIdentifier(Identifier.READ)
  @Get('list')
  menuList(): Promise<Menu[]> {
    return this.menuService.getList();
  }
}
