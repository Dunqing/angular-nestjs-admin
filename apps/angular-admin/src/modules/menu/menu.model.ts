import {
  prop,
  Ref,
  plugin,
  modelOptions,
} from '@typegoose/typegoose';
import {
  IsString,
  IsEnum,
  ArrayUnique,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { Types } from 'mongoose';
import { User } from '../user/user.model';

export enum MenuType {
  Menu = 0,
  ExternalLink = 1,
  Group = 2,
  Button = 3
}

@plugin(AutoIncrementID, {
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
export class Menu {
  _id: string;

  @prop()
  id: number;

  @IsString({ message: '菜单名必须填写（支持html）' })
  @prop({ required: true })
  text: string; // 菜单名

  @IsOptional()
  @IsString({ message: 'link必须为字符串' })
  @prop({ default: '' })
  link?: string; // 路由地址

  @IsOptional()
  @IsString({ message: 'externalLink必须为字符串' })
  @prop()
  externalLink?: string; // 路由地址

  @IsEnum(MenuType, { message: '类型必须填写正确' })
  @prop({ required: true, enum: MenuType })
  type: MenuType; // 类型

  @IsOptional()
  @IsString({ message: '权限标识符必须填写字符串' })
  @prop({ default: '' })
  permissionIdentifier?: string; // 路由地址

  @IsOptional()
  @IsBoolean({ message: 'hide必须为boolean类型'})
  @prop({ default: false })
  hide: boolean
  
  @IsOptional()
  @IsBoolean({ message: 'disabled必须为boolean类型'})
  @prop({ default: false })
  disabled: boolean
  
  @prop({ default: 'appstore' })
  icon: string; // 图标

  @prop({ default: 1 })
  sort: number; //排序用

  @prop({ ref: Menu, default: null })
  pid: Types.ObjectId;

  @prop()
  shortcut?: boolean


  @prop()
  shortcutRoot?: boolean

  @prop()
  reuse?: boolean // 是否允许复用，需配合 reuse-tab 组件
}

export class DelMenus {
  @IsArray({ message: 'menuIds要是数组 example: menuIds: [id1, id2, id3]' })
  @ArrayUnique({ message: 'id有重复' })
  @ArrayNotEmpty({ message: '要删除的菜单id不能为空' })
  menuIds: Types.ObjectId[];
}
