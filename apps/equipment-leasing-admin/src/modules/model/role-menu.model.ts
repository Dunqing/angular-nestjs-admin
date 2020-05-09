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
  ArrayNotEmpty,
  arrayUnique,
  ArrayUnique,
} from 'class-validator';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { hashSync } from 'bcryptjs';
import { Types } from 'mongoose';
import { Role } from '../role/role.model';
import { Menu } from '../menu/menu.model';

export class RoleMenu extends TimeStamps {
  @prop()
  id?: number;

  @prop({ ref: Role, required: true })
  roleId: Types.ObjectId;

  @prop({ ref: Menu, required: true })
  menuId: Types.ObjectId;
}

export class AssigningMenus {
  @IsNotEmpty()
  roleId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  menuId: Array<number>;
}
