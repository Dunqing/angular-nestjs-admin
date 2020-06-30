import { TypegooseClass } from 'nestjs-typegoose/dist/typegoose-class.interface';
import { DynamicModule, Inject } from '@nestjs/common';
import { MONGO_DB_TOKEN } from '../../../../libs/constatns/system.constant';
import { getModelForClass } from '@typegoose/typegoose';
import { mongoose } from './mongoose.transformers';

export class TypegooseModelModule {
  static forFeature(typegooseClass: TypegooseClass[]): DynamicModule {
    const providers = typegooseClass.map(model => {
      return {
        provide: model.name,
        useFactory: async () => {
          return getModelForClass(model);
        },
      };
    });
    return {
      module: TypegooseModelModule,
      providers,
      exports: providers,
    };
  }
}

export const InjectModel = (model: TypegooseClass) => {
  return Inject(model.name);
};
