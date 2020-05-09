export interface HttpErrorOption {
  message: string;
  error?: any;
}

export enum IHttpStatus {
  Error = 'error',
  Success = 'success',
}

export interface HttpPaginateOption<T> {
  data: T;
  paginateParams: any;
  pagination: {
    total: number;
    currentPage: number;
    totalPage: number;
    limit: number;
  };
}

export interface TokenResult {
  accessToken: string;
  expiresTime: number;
}
