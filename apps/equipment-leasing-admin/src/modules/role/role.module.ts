import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Role } from './role.model';
import { User } from '../user/user.model';
import { RoleMenu } from '../model/role-menu.model';
import { MenuModule } from '../menu/menu.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MenuModule, UserModule, TypegooseModule.forFeature([Role, RoleMenu, User])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
