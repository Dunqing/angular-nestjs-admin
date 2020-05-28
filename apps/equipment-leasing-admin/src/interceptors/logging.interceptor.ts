import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // constructor(private loggerService: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle();
    // if (!isDevMode) {
    //   return call$;
    // }
    const request = context.switchToHttp().getRequest();
    const content = request.method + ' -> ' + request.url;
    console.log('+++ 收到请求：', content);
    const now = Date.now();
    return call$.pipe(
      tap(() =>
        console.log('--- 响应请求：', content, `${Date.now() - now}ms`),
      ),
    );
  }
}
