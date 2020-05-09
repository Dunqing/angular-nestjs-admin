import { MongoDbModule } from '../../db/mongo-db.module';
import { Module, Global } from '@nestjs/common';
import { CommonService } from './common.service';

@Global()
@Module({
  imports: [MongoDbModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
