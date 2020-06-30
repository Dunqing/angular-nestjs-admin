import { SystemModule } from './modules/system/system.module';
import { ArticleModule } from './modules/article/article.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { RoleModule } from './modules/role/role.module';
import { CommonModule } from 'libs/common/src/common.module';
import { AdminConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MenuModule } from './modules/menu/menu.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { LoggingModule } from './modules/logging/logging.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    SystemModule, 
    ArticleModule, 
    ConfigurationModule,
    RoleModule,
    AdminConfigModule,
    CommonModule,
    UserModule,
    MenuModule,
    DictionaryModule,
    LoggingModule,
    MulterModule.register({
      dest: 'upload',
      
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
