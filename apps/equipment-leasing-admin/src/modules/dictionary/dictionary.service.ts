import { Injectable } from '@nestjs/common';
import { InjectModel } from '../../transformers/model.transoformer';
import { DictionaryType, Dictionary } from './dictionary.model';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { Types } from 'mongoose';

@Injectable()
export class DictionaryService {

  constructor(
    @InjectModel(Dictionary)
    private readonly dictionaryModel: MongooseModel<Dictionary>,
    @InjectModel(DictionaryType)
    private readonly dictionaryTypeModel: MongooseModel<Dictionary>,
  ) {}

  getTypeLabels(name: string): Promise<Dictionary[]> {
    return this.dictionaryTypeModel.findOne({ name }).then(type => {
      if (!type) {
        return Promise.reject('没有此类型字典');
      }
      return this.dictionaryModel
        .find({ typeId: { $eq: type._id } })
        // .populate('typeId', '-_id name');
    });
  }

  getTypeList(): Promise<any> {
    return this.dictionaryTypeModel.find().exec()
  }  
    
  getTypePagination(querys: any, options: any): Promise<any> {
    return this.dictionaryTypeModel.paginate(querys, options);
  }

  createDictType(data: DictionaryType): Promise<any> {
    console.log(data);
    return this.dictionaryTypeModel
      .findOneAndUpdate({ name: { $eq: data.name } }, data, {
        new: true,
        upsert: true,
      })
      .exec();
    // return this.dictionaryTypeModel.create(data);
  }

  createDictionary(data: Dictionary): Promise<any> {
    return this.dictionaryModel
      .findOneAndUpdate(
        {
          $or: [{ label: { $eq: data.label } }, { value: { $eq: data.value } }],
        },
        data,
        {
          new: true,
          upsert: true,
        },
      )
      .exec();
    // return this.dictionaryModel.create(data);
  }

  delDictionaryType(dictionaryTypeIds: Types.ObjectId[]) {
    return this.dictionaryTypeModel.deleteMany({
      '_id': { $in: dictionaryTypeIds }
    }).then(async (result) => {
      return {
        dictionary: await this.dictionaryModel.deleteMany({
            typeId: { $in: dictionaryTypeIds }
        }),
        dictionaryType: result
      }
    })
  }

  delDictionary(dictionaryIds: Types.ObjectId[]) {
    return this.dictionaryModel.deleteMany({
        _id: { $in: dictionaryIds }
    })
  }

  updateDictionaryType(id: any, body: any) {
    return this.dictionaryTypeModel.findByIdAndUpdate(id, body, { upsert: true })
  }

  updateDictionary(id: any, body: any) {
    return this.dictionaryModel.findByIdAndUpdate(id, body, { upsert: true })
  }
}
