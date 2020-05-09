import { MenuModule } from './../../equipment-leasing-admin/src/modules/menu/menu.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceConfigModule } from './config/config.module';

@Module({
  imports: [MenuModule, ServiceConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
