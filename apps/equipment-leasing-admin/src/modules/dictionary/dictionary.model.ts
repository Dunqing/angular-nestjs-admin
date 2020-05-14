import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { MaxLength, IsNotEmpty } from 'class-validator';

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
    },
  },
})
export class Dictionary {
  _id: any;

  @IsNotEmpty({ message: '必须绑定一个类型' })
  @prop({ ref: 'DictionaryType', required: true })
  typeId: Ref<DictionaryType>;

  @IsNotEmpty({ message: '字典标签需填写' })
  @prop({ required: true })
  label: string;

  @IsNotEmpty({ message: '字典值需填写' })
  @prop({ required: true })
  value: string;

  @MaxLength(30, { message: '描述文字不可以超过三十个字符' })
  @prop({ default: '' })
  description: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
    },
  },
})
export class DictionaryType {
  _id: any;

  @IsNotEmpty({ message: '类型名必须填写' })
  @prop({ required: true })
  name: string;

  @MaxLength(30, { message: '描述文字不可以超过三十个字符' })
  @prop({ default: '' })
  description: string;
}
