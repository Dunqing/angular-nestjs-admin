import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Module, forwardRef } from '@nestjs/common';
import { Menu } from './menu.model';
import { RoleMenu } from '../model/role-menu.model';
import { TypegooseModelModule } from '../../transformers/model.transoformer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypegooseModelModule.forFeature([Menu, RoleMenu]), forwardRef(() => UserModule)],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
