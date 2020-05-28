import { Controller, Post, Body, Get, Delete, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article, DelArticles } from './article.model';
import { QueryParams } from '../../decorators/query-params.decorator';

@Controller('article')
export class ArticleController {
  constructor(
    private articleService: ArticleService
  ) {}

  @Post()
  createArticle(@Body() body: Article) {
    return this.articleService.createArticle(body)
  }

  @Delete()
  deleteArticle(@Body() body: DelArticles) {
    return this.articleService.deleteArticles(body.articleIds)
  }

  @Put(':id')
  updateArticle(@QueryParams() { params }, @Body() body: Article) {
    return this.articleService.updateArticle(params.id, body)
  }

  @Get()
  getAllArticle() {
    return this.articleService.getAllArticle()
  }

  @Get(':id')
  getArticle(@QueryParams() { params }) {
    return this.articleService.getArticle(params.id)
  }
}
