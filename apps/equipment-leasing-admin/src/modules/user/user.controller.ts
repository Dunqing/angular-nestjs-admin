import { UserService } from './user.service';
import { Controller, Get, Post, Body, UseGuards, Delete, Put, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User, UserLogin, DelUsers, ChangePassword } from './user.model';
import { HttpProcessor, handle } from '../../decorators/http.decorator';
import { Paginate, UserInfo } from '../../decorators/query.decorator';
import { LocalAuthGuard } from './passport/local.guard';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import { JwtAuthGuard } from './passport/jwt.guard';
import { QueryParams } from '../../decorators/query-params.decorator';
import { PermissionIdentifier, PermissionNamePrefix } from '../../decorators/permission.decorator';
import { Identifier, NamePrefix } from '../../interfaces/permission.interface';
import { AdvancedOperationsGuard } from '../../guards/advanced-operations.guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
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

  @PermissionIdentifier(Identifier.EDIT)
  @HttpProcessor.handle('修改用户信息')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateInfo(@QueryParams() { params, userInfo }, @Body() body: any) {
    if (body.password) {
      return Promise.reject('禁止在此处修改密码')
    }
    const useEditIds = await this.userService.getUserChildrenId(userInfo._id, false)
    const canEdit = useEditIds.find((user) => user._id.equals(params.id))
    if (canEdit) {
      return this.userService.updateUser(params.id, body)
    }
    return Promise.reject('权限不足，禁止修改用户信息')
  }

  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改密码')
  @Patch('changePassword')
  async changePassword(@QueryParams() { userInfo }, @Body() body: ChangePassword) {
    return this.userService.changePassword(userInfo._id, body)
  }

  // 创建用户
  @PermissionIdentifier(Identifier.ADD)
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('创建用户')
  @Post()
  create(@UserInfo() { _id }, @Body() data: User): Promise<any> {
    return this.userService.createUser(_id, data);
  }

  @PermissionIdentifier(Identifier.DEL)
  @UseGuards(JwtAuthGuard, AdvancedOperationsGuard)
  @HttpProcessor.handle('删除用户')
  @Delete()
  async delete(@Body() body: DelUsers, @UserInfo() userInfo): Promise<any> {
    const childrenId = await this.userService.getUserChildrenId(userInfo._id, true)
    return this.userService.DelUsers(childrenId, body.userIds)
  }

  // 登录
  @HttpProcessor.handle('登录')
  @Post('login')
  login(@QueryParams() { visitors: { ip } }, @Body() data: UserLogin) {
    return this.userService
      .adminLogin(ip, data)
      .then(token => {
        return token;
      })
      .catch(errMessage => {
        throw new UnauthorizedError(errMessage);
      });
  }
}
