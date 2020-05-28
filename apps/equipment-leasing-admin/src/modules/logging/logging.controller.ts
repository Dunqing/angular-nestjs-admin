import { Controller, Post, Body, Get, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from './logging.service';
import { paginate, HttpProcessor } from '../../decorators/http.decorator';
import { QueryParams } from '../../decorators/query-params.decorator';
import { PermissionIdentifier, PermissionNamePrefix } from '../../decorators/permission.decorator';
import { Identifier, NamePrefix } from '../../interfaces/permission.interface';
import { JwtAuthGuard } from '../user/passport/jwt.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('logging')
@Controller('logging')
@PermissionNamePrefix(NamePrefix.Logging)
export class LoggingController {
  constructor(private loggingService: LoggingService) {}

  @PermissionIdentifier(Identifier.READ)
  @HttpProcessor.handle({ usePaginate: true, message: '获取日志' })
  @Get('pagination')
  log(@QueryParams() { querys, options }): Promise<any> {
    return this.loggingService.paginateLog(querys, options)
  }
  
  
  //TODO: 改动前记得去调整删除接口的判断
  @PermissionIdentifier(Identifier.DEL)
  @Delete('all')
  @HttpProcessor.handle('删除全部日志')
  delLogAll() {
    return this.loggingService.delAll()
  }
}
