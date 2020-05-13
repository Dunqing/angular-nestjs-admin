import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Menu } from './menu.model';
import { RoleMenu } from '../model/role-menu.model';

@Module({
  imports: [TypegooseModule.forFeature([Menu, RoleMenu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
