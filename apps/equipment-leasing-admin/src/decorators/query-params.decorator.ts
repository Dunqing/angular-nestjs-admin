import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request, request } from 'express';
import { Types } from 'mongoose';
import { User } from '../modules/user/user.model';
import * as lodash from 'lodash';
import { ESortTypeValue } from '../interfaces/params.interface';

export enum EQueryParamsField {
  Page = 'page',
  Limit = 'limit',
  Sort = 'sort',
  ParamsId = 'paramsId',
  Method = 'method',
  Search = 'search'
}

export interface IQueryParamsConfig {
  [key: string]:
    | string
    | number
    | boolean
    | Types.ObjectId
    | Date
    | RegExp
    | IQueryParamsConfig;
}

export interface IQueryParamsResult {
  querys: IQueryParamsConfig; // 分页查询参数
  options: IQueryParamsConfig; // 分页查询配置
  params: IQueryParamsConfig; // 路由参数
  origin: IQueryParamsConfig; // querys原始参数
  userInfo: User;
  request: Request; // request对象
  visitors: {
    // 访客信息
    ip: string; // 真实 IP
    ua: string; // 用户 UA
    referer: string; // 跳转来源
  };
  isAuthenticated: boolean; // 是否鉴权
}

interface ITransformConfigObject {
  [key: string]: string | number | boolean;
}

interface IValidationFields {
  name: string;
  field: EQueryParamsField;
  isAllowed: boolean;
  setValue(): void;
}

type TTransformConfigObject =
  | EQueryParamsField
  | ITransformConfigObject
  | string;

/**
 * 参数解析器构造器
 * @function QueryParams
 * @description 根据入参配置是否启用某些参数的验证和解析
 * @example @QueryParams()
 * @example @QueryParams([EQPFields.State, EQPFields.Date, { [EQPFields.Page]: 1 }])
 * @example @QueryParams(['custom_query_params', { test_params: true, [EQueryParamsField.Sort]: false }])
 */
export const QueryParams = createParamDecorator(
  (
    customConfig: TTransformConfigObject[],
    ctx: ExecutionContext,
  ): IQueryParamsResult => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const isAuthenticated = request.isAuthenticated();

    const handleFields = [
      'type'
    ]

    const transformConfig: IQueryParamsConfig = {
      [EQueryParamsField.Page]: 1,
      [EQueryParamsField.Limit]: 10,
      [EQueryParamsField.ParamsId]: 'id',
      [EQueryParamsField.Sort]: true,
      [EQueryParamsField.Method]: 'GET',
      [EQueryParamsField.Search]: true
    };

    if (customConfig) {
      customConfig.forEach((field: any) => {
        if (lodash.isString(field)) {
          customConfig[field] = true;
        }
        if (lodash.isObject(field)) {
          Object
          .assign(customConfig, field);
        }
      });
    }

    // 查询参数
    const querys: IQueryParamsConfig = {};

    // 过滤条件
    const options: IQueryParamsConfig = {};

    // 路径参数
    const params: IQueryParamsConfig = lodash.merge(
      { url: request.url },
      request.params as any,
    );

    const paramsId = params[transformConfig.paramsId as string];
    const [page, limit]: any[] = [
      request.query.page,
      request.query.limit,
    ].map(item => (item != null ? Number(item) : item));
    
    const sort: any = request.query.sort
    const search: any = request.query.search
    let useRegex: any = request.query.useRegex === undefined ? true : request.query.useRegex
    try {
      useRegex = eval(useRegex)
    } catch (error) {
      console.log('useRegex 错误', error)
    }
    // 参数提取验证规则
    // 1. field 用于校验这个字段是否被允许用做参数
    // 2. isAllowed 请求参数是否在允许规则之内 -> 400
    // 3. isIllegal 请求参数是否不合法地调用了管理员权限参数 -> 403
    // 任一条件返回错误；否则，设置或重置参数
    const validates: IValidationFields[] = [
      {
        name: '路由/Id',
        field: EQueryParamsField.ParamsId,
        isAllowed: true,
        setValue() {
          if (paramsId != null) {
            params[transformConfig.paramsId as string] = !lodash.isNaN(paramsId)
              ? Types.ObjectId(paramsId as string)
              : Number(paramsId);
          }
        },
      },
      {
        name: '请求方式/method',
        field: EQueryParamsField.Method,
        isAllowed: true,
        setValue() {
          const query: string = request.query.method as string
          if (query) {
            querys[EQueryParamsField.Method] = {
              $in: query.split(',') as any
            }
          }
        }
      },
      {
        name: '搜索/search',
        field: EQueryParamsField.Search,
        // isAllowed: search ? search.indexOf('|KV|') !== -1 : true, 
        isAllowed: true,
        setValue() {
          if (search) {
            const searchValue = search.split(',')
            if (!searchValue.length) {
              return
            }
            querys['$and'] = searchValue.map((key) => {
              const qValue = request.query[key]
              if (qValue === undefined) return { [key]: { $regex: '' } }
              return {
                [key]: useRegex ? { $regex: qValue} : qValue
              }
            })
          }
        },
      },
      {
        name: '排序/sort',
        field: EQueryParamsField.Sort,
        isAllowed: sort ? sort.indexOf('_') !== -1 : true, 
        setValue() {
          if (sort) {
            const sortVariable = sort.split('_')
            try {
              options[EQueryParamsField.Sort] = {
                [sortVariable[0]]: ESortTypeValue[sortVariable[1]] !== undefined ? ESortTypeValue[sortVariable[1]] : Number(sortVariable[1]) 
              }
            } catch (error) {
              this.isAllowed = false
            }
          }
        },
      },
      {
        name: '页码/page',
        field: EQueryParamsField.Page,
        isAllowed:
          lodash.isUndefined(page) ||
          (lodash.isInteger(page) && Number(page) > 0),
        setValue() {
          options.page = page || 1;
        },
      },
      {
        name: '页展示数量/limit',
        field: EQueryParamsField.Limit,
        isAllowed:
          lodash.isUndefined(limit) ||
          (lodash.isInteger(limit) && Number(limit) > 0),
        setValue() {
          options.limit = limit || 10;
        },
      },
    ];

    const isEnableField = field => field != null && field != false;
    validates.forEach(validate => {
      if (!isEnableField(transformConfig[validate.field])) {
        return false;
      }
      
      if (!validate.isAllowed) {
        throw new BadRequestException(`参数不合法：${validate.name}`);
      }

      validate.setValue();
    });

    // 处理好的字段
    const isProcessedFields = validates.map(validate => validate.field);
    // 允许处理的字段
    const allAllowFields = Object.keys(transformConfig);
    const waitHandle = handleFields.concat(allAllowFields)
    // 需要其他方法处理的字段
    const todoFields: string[] = lodash.difference(
      waitHandle,
      isProcessedFields
    );
    // 将所有未处理字段添加到querys
    if (todoFields.length) {
      todoFields.forEach(filed => {
        const value = request.query[filed];
        if (value != null) {
          querys[filed as any] = value as any;
        }
      });
    }
    // 挂载到request
    (request as any).queryParams = { querys, options, params, isAuthenticated };

    // 来源 IP
    const ip = ((request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request?.socket?.remoteAddress ||
      request.ip ||
      request.ips[0]) as string).replace('::ffff:', '');

    // 用户标识
    const ua = request.headers['user-agent'];

    console.log(querys, 'querys')
    console.log(options, 'options')

    const result = {
      querys,
      options,
      params,
      origin: request.query,
      userInfo: request?.user,
      // request,
      visitors: { ip, ua, referer: request.headers?.referer },
      isAuthenticated,
    };
    return result as any;
  },
);
