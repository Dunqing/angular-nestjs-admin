import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Module } from '@nestjs/common';
import { Role } from './role.model';
import { User } from '../user/user.model';
import { RoleMenu } from '../model/role-menu.model';
import { MenuModule } from '../menu/menu.module';
import { UserModule } from '../user/user.module';
import { TypegooseModelModule } from '../../transformers/model.transoformer';

@Module({
  imports: [
    MenuModule,
    UserModule,
    TypegooseModelModule.forFeature([Role, RoleMenu, User]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
