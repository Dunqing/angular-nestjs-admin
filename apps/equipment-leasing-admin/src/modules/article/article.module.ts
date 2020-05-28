import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Module } from '@nestjs/common';
import { TypegooseModelModule } from '../../transformers/model.transoformer';
import { Article } from './article.model';

@Module({
    imports: [
        TypegooseModelModule.forFeature([Article])
    ],
    controllers: [
        ArticleController, ],
    providers: [
        ArticleService, ],
})
export class ArticleModule {}
