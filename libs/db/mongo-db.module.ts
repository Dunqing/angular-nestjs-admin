import { Module, Global } from '@nestjs/common';
import { mongoProvider } from './mongo-db.provider';

@Global()
@Module({
  imports: [],
  providers: [mongoProvider],
  exports: [mongoProvider],
})
export class MongoDbModule {}
