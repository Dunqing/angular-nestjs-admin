import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
} from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../modules/user/user.model';
import { Schema } from 'mongoose';
import { plugin } from '@typegoose/typegoose';
import { mongoosePaginate } from '../transformers/mongoose.transformers';

enum LoggingType {
  normal = 0,
  exception = 1,
}

@plugin(mongoosePaginate)
@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
    },
  },
})
export class OperationLog {
  _id?: any;

  @ApiProperty({ example: '获取信息成功' })
  @prop({ default: '' })
  title?: string;

  @ApiProperty({
    example: LoggingType.normal,
  })
  @prop({ enum: LoggingType, default: LoggingType.normal })
  type?: LoggingType;

  @ApiProperty({
    example: '5eac4f228bf7bfdeadceb3ba',
  })
  @prop({ ref: 'User' })
  userId?: Ref<User>;

  @ApiProperty({ example: 'http://www.baidu.com' })
  @prop()
  url?: string;

  @ApiProperty({ example: 'http://192.168.0.227' })
  @prop()
  ip?: string;

  @ApiProperty({ example: 'GET' })
  @prop()
  method?: string;

  @ApiProperty({ example: 'User' })
  @prop()
  controllerName?: string;

  @ApiProperty({ example: 'create' })
  @prop()
  funcName?: string;

  @ApiProperty({ example: '{wewq}' })
  @prop()
  body?: string;

  @ApiProperty({ example: 'wednlsdfasdasd' })
  @prop()
  stack?: Schema.Types.Mixed;
}

export const OperationLogModel = getModelForClass(OperationLog);
