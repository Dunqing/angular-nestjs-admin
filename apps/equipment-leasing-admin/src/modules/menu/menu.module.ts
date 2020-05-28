import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Module } from '@nestjs/common';
import { Menu } from './menu.model';
import { RoleMenu } from '../model/role-menu.model';
import { TypegooseModelModule } from '../../transformers/model.transoformer';

@Module({
  imports: [TypegooseModelModule.forFeature([Menu, RoleMenu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
