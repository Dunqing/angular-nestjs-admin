import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_DB_URL,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
    }),
  ],
})
export class MongoDbModule {}
