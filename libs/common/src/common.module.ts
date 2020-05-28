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
        // host: 'localhost',
        // port: 6379,
        url: 'redis://localhost:6379',
      },
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
