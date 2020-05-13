import * as _mongoose from 'mongoose';
import * as _mongoosePaginateV2 from 'mongoose-paginate-v2';
import * as _mongooseAggregatePaginateV2 from 'mongoose-aggregate-paginate-v2'

(_mongoose as any).Promise = global.Promise;

export const mongoose = _mongoose;
export const mongoosePaginate = _mongoosePaginateV2;
export const mongooseAggregatePaginateV2 = _mongooseAggregatePaginateV2