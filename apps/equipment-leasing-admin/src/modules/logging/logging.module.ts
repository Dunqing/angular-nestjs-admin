import { Module } from '@nestjs/common';
import { OperationLog } from '../../models/operation-log.model';
import { LoggingController } from './logging.controller';
import { LoggingService } from './logging.service';
import { TypegooseModelModule } from '../../transformers/model.transoformer';

@Module({
  imports: [TypegooseModelModule.forFeature([OperationLog])],
  controllers: [LoggingController],
  providers: [LoggingService],
})
export class LoggingModule {}
