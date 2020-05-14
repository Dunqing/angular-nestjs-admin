import { DictionaryTypeController } from './../../equipment-leasing-admin/src/modules/dictionary/dictionary-type.controller';
import { DictionaryModule } from './../../equipment-leasing-admin/src/modules/dictionary/dictionary.module';
import { MenuModule } from './../../equipment-leasing-admin/src/modules/menu/menu.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceConfigModule } from './config/config.module';

@Module({
  imports: [DictionaryModule, MenuModule, ServiceConfigModule],
  controllers: [DictionaryTypeController, AppController],
  providers: [AppService],
})
export class AppModule {}
