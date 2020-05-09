import { RoleModule } from './modules/role/role.module';
import { CommonModule } from 'libs/common/src/common.module';
import { AdminConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MenuModule } from './modules/menu/menu.module';

@Module({
  imports: [
    RoleModule,
    AdminConfigModule,
    CommonModule,
    UserModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
