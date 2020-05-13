import { isString } from 'lodash';
import { mongoosePaginate, mongooseAggregatePaginateV2 } from '../../transformers/model.transformers';
import { pre, prop, Ref, plugin } from '@typegoose/typegoose';
import {
  IsDefined,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  IsUrl,
  MinLength,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayUnique,
  ArrayNotEmpty,
} from 'class-validator';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { hashSync } from 'bcryptjs';
import { Types } from 'mongoose';

@plugin(AutoIncrementID, {
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
@plugin(mongooseAggregatePaginateV2)
export class Role extends TimeStamps {

  _id: any;

  @prop()
  id?: number;

  @prop({ ref: 'Role', default: null })
  creatorId: Ref<Role>;

  @IsNotEmpty({ message: '必须填写角色名' })
  @IsString({ message: '' })
  @prop({ required: true })
  name: string;

  @prop({ default: '' })
  explanation?: string;
}

export class AssigningRoles {
  @IsNotEmpty({ message: '用户id不可以为空' })
  userId: Types.ObjectId;

  @IsArray({ message: '必须是数组' })
  @ArrayUnique({ message: '角色id不能重复' })
  roleIds: Types.ObjectId[];
}

export class DelRoles {
  @IsArray({ message: '必须是数组' })
  @ArrayUnique({ message: '角色id不能重复' })
  @ArrayNotEmpty({ message: '要删除的菜单id不能为空'})
  roleIds: Types.ObjectId[]
}
