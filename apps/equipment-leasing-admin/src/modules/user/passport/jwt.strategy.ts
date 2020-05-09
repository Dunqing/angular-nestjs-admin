import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { UnauthorizedError } from '../../../errors/unauthorized.error';
import { SUPER_ADMIN_ID } from '../../../constants/meta.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ _id }: { _id: string }) {
    const user = await this.userService.getUserById(_id);
    if (!user) {
      throw new UnauthorizedError('查询不到用户！');
    }
    user['superAdmin'] = _id === SUPER_ADMIN_ID
    return user;
  }
}
