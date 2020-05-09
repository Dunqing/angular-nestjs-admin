import { Controller, Post, Body, Get, Query, Param, UseGuards, Put } from '@nestjs/common';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { Paginate, UserInfo } from '../../decorators/query.decorator';
import { HttpProcessor } from '../../decorators/http.decorator';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/passport/jwt.guard';
import { User } from '../user/user.model';

@ApiTags('menus')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UserInfo() user: any, @Body() data: Menu): Promise<Menu> {
    return this.menuService.createMenu(user._id, data);
  }

  @Get('merge')
  mergeMenu(): Promise<Menu[]> {
    return this.menuService.getMergeMenu();
  }

  @Get('merge/:id')
  mergeMenuById(@Param('id') _id: string): Promise<Menu[]> {
    return this.menuService.getMergeMenu(_id);
  }

  @Put()
  updateMenu(@Body() data: Menu): Promise<Menu> {
    // console.log(this.menuService.updateMenu(data))
    return this.menuService.updateMenu(data)
  }

  // @HttpProcessor.paginate()
  @HttpProcessor.handle('获取菜单列表')
  @Get('list')
  menuList(): Promise<Menu[]> {
    return this.menuService.getList();
  }
}
