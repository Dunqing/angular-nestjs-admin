import * as _mongoose from 'mongoose';
import * as _mongoosePaginate from 'mongoose-paginate';

(_mongoose as any).Promise = global.Promise;

export const mongoose = _mongoose;
export const mongoosePaginate = _mongoosePaginate;
