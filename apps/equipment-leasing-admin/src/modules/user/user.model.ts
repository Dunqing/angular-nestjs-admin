import { mongoosePaginate } from './../../transformers/model.transformers';
import { pre, prop, Ref, plugin, arrayProp } from '@typegoose/typegoose';
import {
  IsDefined,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  IsUrl,
  MinLength,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
  ArrayUnique
} from 'class-validator';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { hashSync } from 'bcryptjs';
import { Role } from '../role/role.model';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

enum Status {
  enable, // 启用
  disable, // 禁用
}

@plugin(AutoIncrementID, {
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
@plugin(mongoosePaginate)
export class User extends TimeStamps {
  // @prop({ select: false })
  // _id: string
  _id: Types.ObjectId
  
  @prop()
  id: number;

  @prop({ ref: 'User', default: null })
  creatorId: Ref<User>;

  @ApiProperty()
  @IsDefined({ message: '账号名不能为空' })
  @IsString({ message: '请正确输入账号' })
  @prop({ required: true })
  username!: string;

  @IsDefined({ message: '昵称不可以为空！' })
  @IsString({ message: '请正确输入昵称' })
  @prop({ default: '我的名字' })
  nickname: string;

  @IsDefined({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最少6位' })
  @prop({
    required: true,
    select: false,
    get(val) {
      return val;
    },
    set(val) {
      return hashSync(val);
    },
  })
  password!: string;

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'] }, { message: '你的头像？' })
  @prop({
    default:
      'https://zhiniao-fby.oss-cn-shenzhen.aliyuncs.com/net/zhiniao/fby-mini-app/uploads/wx347e9ae0cf3be45d.o6zAJs6eQg5n8czE_b0cmaAN0hhw.AgLYdKXfxkhq1a04c3b31051863576cb88b3e2fdc999.gif',
  })
  avatar: string;

  @IsOptional()
  @IsPhoneNumber('CN', {
    message: '你的手机号？',
  })
  @prop({ default: '', validate: /\d{11}/ })
  phoneNumber?: string;

  @prop({ default: Date.now })
  lastLoginTime?: Date;

  @prop({ default: '127.0.0.1' })
  lastLoginIp?: string;

  // @prop({ })
  @arrayProp({ ref: Role, itemsType: Types.ObjectId, default: [] })
  roles?: Types.ObjectId[];

  @IsOptional()
  @IsEnum(Status)
  @prop({
    default: Status.enable,
    enum: Status,
  })
  status?: number;
}

export class UserLogin {
  @ApiProperty({ example: 'admin2' })
  @IsNotEmpty({ message: '账号名不能为空' })
  @IsString({ message: '请正确输入账号' })
  @MinLength(5, { message: '账号最少5位' })
  username!: string;

  @ApiProperty({ example: '123456' })
  @IsDefined({ message: '密码不能为空' })
  @IsString({ message: '请正确输入账号' })
  @MinLength(6, { message: '密码最少6位' })
  password!: string;
}

export class DelUsers {
  @IsArray({ message: '必须是数组' })
  @ArrayUnique({ message: '用户id不能重复' })
  @ArrayNotEmpty({ message: '用户id不能为空 '})
  userIds: Types.ObjectId[];
}