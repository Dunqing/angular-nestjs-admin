import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { UnauthorizedError } from '../../../errors/unauthorized.error';
import { SUPER_ADMIN_ID } from '../../../constants/meta.constant';
import { RoleService } from '../../role/role.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ _id }: { _id: string }) {
    const users = (await this.userService.getUserById(_id));
    const user = users.length ? users[0] : undefined
    // const roleIds = user.roles.map((item: any) => item._id)
    if (!user) {
      throw new UnauthorizedError('查询不到用户！');
    }
    user['superAdmin'] = _id === SUPER_ADMIN_ID
    return user;
  }
}
