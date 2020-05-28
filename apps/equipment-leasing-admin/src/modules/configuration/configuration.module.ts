import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { Module } from '@nestjs/common';
import { Configuration } from './configuration.model';
import { TypegooseModelModule } from '../../transformers/model.transoformer';

@Module({
  imports: [TypegooseModelModule.forFeature([Configuration])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
