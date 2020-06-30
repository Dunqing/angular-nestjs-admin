import { Injectable } from '@nestjs/common';
import { InjectModel } from '../../transformers/model.transoformer';
import { Article } from './article.model';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { Types } from 'mongoose';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article) private articleModel: MongooseModel<Article>
  ) {}
    
  paginateArticle(querys: any, options: any): Promise<any> {
    return this.articleModel.paginate(querys, options)
  }

  updateArticle(id: any, body: Article) {
    return this.articleModel.findByIdAndUpdate(id, body)
  }

  deleteArticles(articleIds: Types.ObjectId[]) {
    return this.articleModel.deleteMany({
      _id: { $in: articleIds }
    })
  }

  createArticle(data: Article) {
    return this.articleModel.create(data)
  }

  getAllArticle() {
    return this.articleModel.find()
  }

  getArticle(id: Types.ObjectId) {
    return this.articleModel.findById(id)
  }
}
