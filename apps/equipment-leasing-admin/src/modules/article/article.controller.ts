import { Controller, Post, Body, Get, Delete, Put, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article, DelArticles } from './article.model';
import { QueryParams } from '../../decorators/query-params.decorator';
import { JwtAuthGuard } from '../user/passport/jwt.guard';
import { PermissionNamePrefix, PermissionIdentifier } from '../../decorators/permission.decorator';
import { NamePrefix, Identifier } from '../../interfaces/permission.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpProcessor } from '../../decorators/http.decorator';

@PermissionNamePrefix(NamePrefix.Article)
@ApiBearerAuth()
@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(
    private articleService: ArticleService
  ) {}


  @PermissionIdentifier(Identifier.ADD)
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpProcessor.handle('创建文章')
  createArticle(@Body() body: Article) {
    return this.articleService.createArticle(body)
  }

  @HttpProcessor.handle('删除文章')
  @PermissionIdentifier(Identifier.DEL)
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteArticle(@Body() body: DelArticles) {
    return this.articleService.deleteArticles(body.articleIds)
  }
  
  @HttpProcessor.handle('修改文章')
  @PermissionIdentifier(Identifier.EDIT)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateArticle(@QueryParams() { params }, @Body() body: Article) {
    return this.articleService.updateArticle(params.id, body)
  }
  
  @HttpProcessor.handle('获取文章列表')
  @PermissionIdentifier(Identifier.READ)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllArticle() {
    return this.articleService.getAllArticle()
  }

  @HttpProcessor.handle({ message: '获取文章列表', usePaginate: true })
  @PermissionIdentifier(Identifier.READ)
  @UseGuards(JwtAuthGuard)
  @Get('pagination')
  paginateArticle(@QueryParams() { querys, options }): Promise<any> {
    return this.articleService.paginateArticle(querys, options)
  }

  @HttpProcessor.handle('获取文章')
  @Get(':id')
  getArticle(@QueryParams() { params }) {
    return this.articleService.getArticle(params.id)
  }
}
