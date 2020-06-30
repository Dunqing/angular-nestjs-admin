import { isObject } from 'lodash';
import { HttpStatus, SetMetadata, applyDecorators } from '@nestjs/common';
import * as TEXT from '../constants/text.constant';
import * as META from '../constants/meta.constant';

interface IBuilderDecoratorOption {
  errorCode?: HttpStatus;
  errorMessage?: string;
  successCode?: HttpStatus;
  successMessage?: string;
  usePaginate?: boolean;
}

interface IHandleOption {
  errorCode?: HttpStatus;
  successCode?: HttpStatus;
  message: string;
  usePaginate?: boolean;
}

type THandelOption = IHandleOption | string;

function builderHttpDecorator(
  options: IBuilderDecoratorOption,
): MethodDecorator {
  const {
    errorCode,
    errorMessage,
    successMessage,
    successCode,
    usePaginate,
  } = options;

  const setMetaDataList = [];
  if (errorMessage) {
    setMetaDataList.push(SetMetadata(META.HTTP_ERROR_MESSAGE, errorMessage));
  }
  if (errorCode) {
    setMetaDataList.push(SetMetadata(META.HTTP_ERROR_CODE, errorCode));
  }
  if (successMessage) {
    setMetaDataList.push(
      SetMetadata(META.HTTP_SUCCESS_MESSAGE, successMessage),
    );
  }
  if (successCode) {
    setMetaDataList.push(SetMetadata(META.HTTP_SUCCESS_CODE, successCode));
  }
  if (usePaginate) {
    setMetaDataList.push(SetMetadata(META.HTTP_PAGINATE, usePaginate));
  }
  return applyDecorators(...setMetaDataList);
}

export function handle(args: THandelOption);
export function handle(...args) {
  const option = args[0];
  const isOption = (value: THandelOption): value is IHandleOption =>
    isObject(value);
  const message: string = isOption(option) ? option.message : option;
  const successMessage = message + TEXT.HTTP_SUCCESS_PREFIX;
  const errorMessage = message + TEXT.HTTP_ERROR_PREFIX;
  const successCode = isOption(option) ? option.successCode : null;
  const errorCode = isOption(option) ? option.errorCode : null;
  const usePaginate = isOption(option) ? option.usePaginate : null;
  return builderHttpDecorator({
    errorCode,
    errorMessage,
    successCode,
    successMessage,
    usePaginate,
  });
}

export function paginate() {
  return builderHttpDecorator({ usePaginate: true });
}

export const HttpProcessor = {
  handle,
  paginate,
};
