import { isString } from 'lodash';
import { mongoosePaginate } from '../../transformers/model.transformers';
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
} from 'class-validator';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { hashSync } from 'bcryptjs';

@plugin(AutoIncrementID, {
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
@plugin(mongoosePaginate)
export class Role extends TimeStamps {
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
  @IsNumber({}, { message: 'id必须为数字' })
  userId: number;
  @IsNotEmpty({ message: '角色id不可以为空' })
  @IsNumber({}, { each: true, message: 'id必须为数字' })
  roleId: Array<number>;
}
