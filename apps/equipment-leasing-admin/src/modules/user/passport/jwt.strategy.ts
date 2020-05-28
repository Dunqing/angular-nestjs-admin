import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { UnauthorizedError } from '../../../errors/unauthorized.error';
import { SUPER_ADMIN_ID } from '../../../constants/meta.constant';
import { CustomError } from '../../../errors/custom.error';
import { UserRedisService } from '../user-redis.service';

interface EncryptData {
  _id: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRedisService: UserRedisService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: true,
        passReqToCallback: true,
        secretOrKey: process.env.JWT_SECRET,
      },
      /**
       *
       * @param request 请求对象
       * @param encryptData 解密后数据
       * @param verify 不用
       */
      async function(request: Request, encryptData: EncryptData, verify) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request as any);
        const user = await userRedisService.tokenToUser(token);
        if (!user) {
          this.fail(new UnauthorizedError('未授权'));
        }
        this.success(user);
      },
    );
  }

  // async validate({ _id }: { _id: string }) {
  //   // console.log(arguments);
  //   const users = await this.userRedisService.getUserById(_id);
  //   const user = users.length ? users[0] : undefined;
  //   // const roleIds = user.roles.map((item: any) => item._id)
  //   if (!user) {
  //     throw new UnauthorizedError('查询不到用户！');
  //   }
  //   user['superAdmin'] = _id === SUPER_ADMIN_ID;
  //   return user;
  // }
}
