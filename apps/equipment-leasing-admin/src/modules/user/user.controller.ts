import { UserService } from './user.service';
import { Controller, Get, Post, Body, UseGuards, Delete, Put, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User, UserLogin, DelUsers } from './user.model';
import { HttpProcessor, handle } from '../../decorators/http.decorator';
import { Paginate, UserInfo } from '../../decorators/query.decorator';
import { LocalAuthGuard } from './passport/local.guard';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import { JwtAuthGuard } from './passport/jwt.guard';
import { QueryParams } from '../../decorators/query-params.decorator';
import { PermissionIdentifier, PermissionNamePrefix } from '../../decorators/permission.decorator';
import { Identifier, NamePrefix } from '../../interfaces/permission.interface';
import { AdminGuards } from '../../guards/admin.guard';

@ApiTags('Users')
@Controller('users')
@PermissionNamePrefix(NamePrefix.User)
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('查询个人信息')
  @ApiBearerAuth()
  @Get('info')
  userInfo(@QueryParams() q, @UserInfo() user): any {
    // return this.userService.getUserChildrenId(user._id)
    return user;
  }

  @ApiBearerAuth()
  @HttpProcessor.handle('查询个人菜单')
  @UseGuards(JwtAuthGuard)
  @Get('menu')
  menu(@UserInfo() user): Promise<any> {
    return this.userService.currentUserMenu(user);
  }

  @PermissionIdentifier(Identifier.READ)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取用户列表')
  @UseGuards(JwtAuthGuard)
  @Get()
  async userPaginateList(@Paginate() options, @UserInfo() userInfo): Promise<any> {
    const childrenId = await this.userService.getUserChildrenId(userInfo._id, true)
    const query = {
      _id: {
        $in: childrenId
      }
    }
    return this.userService.getPaginateList(query, options);
  }

  // @Put(':id')
  // updateInfo(@Param('id') id: string, @Body() body) {
    
  // }
  // 创建用户
  @PermissionIdentifier(Identifier.ADD)
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('创建用户')
  @ApiBearerAuth()
  @Post()
  create(@UserInfo() { _id }, @Body() data: User): Promise<any> {
    return this.userService.createUser(_id, data);
  }

  @PermissionIdentifier(Identifier.DEL)
  @UseGuards(JwtAuthGuard, AdminGuards)
  @HttpProcessor.handle('删除用户')
  @Delete()
  async delete(@Body() body: DelUsers, @UserInfo() userInfo): Promise<any> {
    const childrenId = await this.userService.getUserChildrenId(userInfo._id, true)
    return this.userService.DelUsers(childrenId, body.userIds)
  }

  // 登录
  @HttpProcessor.handle('登录')
  @Post('login')
  login(@Body() data: UserLogin) {
    return this.userService
      .adminLogin(data)
      .then(token => {
        return token;
      })
      .catch(errMessage => {
        throw new UnauthorizedError(errMessage);
      });
  }
}
