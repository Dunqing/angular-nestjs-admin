import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedError } from 'apps/equipment-leasing-admin/src/errors/unauthorized.error';
import { UserService } from '../user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      console.log(username, password);
      const user = await this.userService.adminLogin({ username, password });
      return user;
    } catch (errMessage) {
      throw new UnauthorizedError(errMessage);
    }
  }
}
