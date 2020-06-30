/*
 * @Author: your name
 * @Date: 2020-06-26 23:55:01
 * @LastEditTime: 2020-06-30 17:48:13
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \angular-nestjs-admin\apps\angular-admin\src\modules\user\passport\local.strategy.ts
 */ 
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { UnauthorizedError } from '@app/admin/errors/unauthorized.error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      // const user = await this.userService.adminLogin({ username, password });
      // return user;
    } catch (errMessage) {
      throw new UnauthorizedError(errMessage);
    }
  }
}
