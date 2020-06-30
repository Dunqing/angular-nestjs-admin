import {
  DictionaryController,
  DictionaryTypeController,
} from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { Module } from '@nestjs/common';
import { Dictionary, DictionaryType } from './dictionary.model';
import { TypegooseModelModule } from '../../transformers/model.transoformer';

@Module({
  imports: [TypegooseModelModule.forFeature([Dictionary, DictionaryType])],
  controllers: [DictionaryController, DictionaryTypeController],
  providers: [DictionaryService],
})
export class DictionaryModule {}
