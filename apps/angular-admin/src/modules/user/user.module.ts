import { User } from './user.model';
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { MenuModule } from '../menu/menu.module';
import { RoleMenu } from '../model/role-menu.model';
import { TypegooseModelModule } from '../../transformers/model.transoformer';
import { UserRedisService } from './user-redis.service';
@Module({
  imports: [
    TypegooseModelModule.forFeature([User, RoleMenu]),
    PassportModule,
    forwardRef(() => MenuModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: Number(process.env.EXPIRES_TIME),
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRedisService, LocalStrategy, JwtStrategy],
  exports: [UserService, UserRedisService],
})
export class UserModule {}
