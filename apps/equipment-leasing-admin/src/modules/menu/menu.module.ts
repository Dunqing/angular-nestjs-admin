import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Menu } from './menu.model';

@Module({
  imports: [TypegooseModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
