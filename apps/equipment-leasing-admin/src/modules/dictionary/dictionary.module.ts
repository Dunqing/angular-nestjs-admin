import {
  DictionaryController,
  DictionaryTypeController,
} from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Dictionary, DictionaryType } from './dictionary.model';

@Module({
  imports: [TypegooseModule.forFeature([Dictionary, DictionaryType])],
  controllers: [DictionaryController, DictionaryTypeController],
  providers: [DictionaryService],
})
export class DictionaryModule {}
