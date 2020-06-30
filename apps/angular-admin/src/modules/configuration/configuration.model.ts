import { prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

enum ConfigType {
  Admin,
  Application,
}

enum ParameterType {
  Number = 'number',
  Boolean = 'boolean',
  Array = 'array',
  String = 'string',
}
export class Configuration {
  _id: any;

  @ApiProperty({ example: 'banner图' })
  @prop({ required: true })
  name: string; //

  @ApiProperty({ example: ConfigType.Application })
  @prop({ enum: ConfigType, required: true })
  type: ConfigType;

  @ApiProperty({ example: ParameterType.Array })
  @prop({ required: true, enum: ParameterType })
  parameterType: ParameterType;
}
