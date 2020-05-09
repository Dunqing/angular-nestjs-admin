import { UserService } from './user.service';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User, UserLogin } from './user.model';
import { HttpProcessor, handle } from '../../decorators/http.decorator';
import { Paginate, UserInfo } from '../../decorators/query.decorator';
import { LocalAuthGuard } from './passport/local.guard';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import { JwtAuthGuard } from './passport/jwt.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('查询个人信息')
  @ApiBearerAuth()
  @Get('info')
  userInfo(@UserInfo() user) {
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

  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取用户列表')
  @Get('list')
  userPaginateList(@Paginate() options): Promise<any> {
    return this.userService.getPaginateList(null, options);
  }

  // 创建用户
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('创建用户')
  @ApiBearerAuth()
  @Post()
  create(@UserInfo() { _id }, @Body() data: User): Promise<any> {
    return this.userService.createUser(_id, data);
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
