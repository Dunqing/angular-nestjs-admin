import { MongoDbModule } from '../../db/mongo-db.module';
import { Module, Global } from '@nestjs/common';
import { CommonService } from './common.service';
import { RedisModule } from '@svtslv/nestjs-ioredis';

@Global()
@Module({
  imports: [
    MongoDbModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
