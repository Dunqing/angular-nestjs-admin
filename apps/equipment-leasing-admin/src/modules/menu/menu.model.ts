import { pre, prop, Ref, plugin, arrayProp, modelOptions } from '@typegoose/typegoose';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  ArrayUnique,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { Types } from 'mongoose';
import { User } from '../user/user.model';

enum MetaStatus {
  No,
  Yes,
}

export enum MenuType  {
  Menu = 0,
  Button = 1
}

@modelOptions({

})
class RouteMeta {
  @IsString({ message: '菜单名必须填写' })
  @prop({ required: true })
  title: string; // 菜单名

  @prop({ default: '' })
  icon: string; // 菜单图标

  @IsEnum(MetaStatus)
  @prop({ default: MetaStatus.Yes })
  alwaysShow: MetaStatus; // 显示根路由

  @IsEnum(MetaStatus)
  @prop({ default: MetaStatus.Yes })
  hidden: MetaStatus; // 侧边栏显示

  @IsEnum(MetaStatus)
  @prop({ default: MetaStatus.Yes })
  breadcrumb: MetaStatus; // 在面包屑显示

  @IsEnum(MetaStatus)
  @prop({ default: MetaStatus.Yes })
  noCache: MetaStatus; // 缓存页面

  @IsEnum(MetaStatus)
  @prop({ default: MetaStatus.Yes })
  affix: MetaStatus; // 固定在面包屑前面
}

@plugin(AutoIncrementID, {
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
export class Menu {
  _id: string

  @prop()
  id: number;

  @prop({ ref: 'User', default: null })
  creatorId: Ref<User>;

  @IsString({ message: '名称必须填写' })
  @prop({ required: true })
  name: string; // 路由地址

  @IsString({ message: '路由地址必须填写' })
  @prop({ default: '' })
  path?: string; // 路由地址

  @IsEnum(MenuType, { message: '类型必须填写正确' })
  @prop({ required: true, enum: MenuType })
  type: MenuType; // 路由地址

  @IsOptional()
  @IsString({ message: '权限标识符必须填写字符串' })
  @prop({ default: '' })
  permissionIdentifier?: string; // 路由地址

  @prop({ default: 1 })
  sort: number; //排序用

  @prop({ default: '' })
  componentPath?: string; // 组件地址

  @prop({ ref: Menu, default: null })
  pid: Types.ObjectId;

  @prop({ required: true, _id: false })
  meta?: RouteMeta; // meta 选项
}

export class DelMenus {
  @IsArray({ message: 'menuIds要是数组 example: menuIds: [id1, id2, id3]'})
  @ArrayUnique({ message: 'id有重复'})
  @ArrayNotEmpty({ message: '要删除的菜单id不能为空'})
  menuIds: Types.ObjectId[]
}
