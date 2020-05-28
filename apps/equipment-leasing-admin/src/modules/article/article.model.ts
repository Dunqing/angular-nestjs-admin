import {
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { plugin } from '@typegoose/typegoose';
import { mongoosePaginate } from '../../transformers/mongoose.transformers';
import { IsArray, ArrayUnique, ArrayNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

@plugin(mongoosePaginate)
@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
    },
  },
})
export class Article {
  _id?: any;

  @ApiProperty({ example: '文章标题' })
  @prop({ default: '' })
  title?: string;

  @ApiProperty({ example: '<h1>文章内容</h1>' })
  @prop({ default: '' })
  content?: string;
}

export class DelArticles {
  @IsArray({ message: '必须是数组' })
  @ArrayUnique({ message: '文章id不能重复' })
  @ArrayNotEmpty({ message: '文章id不能为空 ' })
  articleIds: Types.ObjectId[];
}