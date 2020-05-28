import { Injectable } from '@nestjs/common';
import { Configuration } from './configuration.model';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { InjectModel } from '../../transformers/model.transoformer';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration)
    private readonly configurationModel: MongooseModel<Configuration>,
  ) {}

  create(body: Configuration) {
    return this.configurationModel.create(body);
  }
}
