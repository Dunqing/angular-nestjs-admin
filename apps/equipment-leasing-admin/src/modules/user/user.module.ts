import { User } from './user.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { MenuModule } from '../menu/menu.module';
import { RoleMenu } from '../model/role-menu.model';
@Module({
  imports: [
    TypegooseModule.forFeature([User, RoleMenu]),
    PassportModule,
    MenuModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: Number(process.env.EXPIRES_TIME),
        }
      })
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [UserService]
})
export class UserModule {}
