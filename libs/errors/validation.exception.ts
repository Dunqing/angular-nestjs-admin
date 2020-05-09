import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import * as TEXT from 'libs/constatns/text.constatn';

/**
 * @class ValidationError
 * @classdesc 400 -> 数据验证错误
 * @example new ValidationError('错误')
 * @example new ValidationError(new Error())
 */
export class ValidationError extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.VALIDATION_ERROR_DEFAULT, HttpStatus.BAD_REQUEST);
  }
}
