/*
 * @Author: your name
 * @Date: 2020-06-26 23:55:01
 * @LastEditTime: 2020-06-30 17:47:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \angular-nestjs-admin\apps\angular-service\src\app.module.ts
 */ 
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceConfigModule } from './config/config.module';
import { MenuModule } from '@app/admin/modules/menu/menu.module';
import { DictionaryModule } from '@app/admin/modules/dictionary/dictionary.module';
import { DictionaryTypeController } from '@app/admin/modules/dictionary/dictionary.controller';

@Module({
  imports: [DictionaryModule, MenuModule, ServiceConfigModule],
  controllers: [DictionaryTypeController, AppController],
  providers: [AppService],
})
export class AppModule {}
