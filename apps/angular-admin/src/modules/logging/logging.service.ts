import { Injectable, Body } from '@nestjs/common';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { OperationLog } from '../../models/operation-log.model';
import { InjectModel } from '../../transformers/model.transoformer';

@Injectable()
export class LoggingService {
  
  constructor(
    @InjectModel(OperationLog)
    private readonly operationLogModel: MongooseModel<OperationLog>,
    ) {}
    
    paginateLog(querys: any, options: any): Promise<any> {
      return this.operationLogModel.paginate(querys, options)
    }

    delAll() {
      return this.operationLogModel.deleteMany({
        $and: [
          { funcName: { $ne: 'delLogAll' }},
        ]
      })
    }
}
