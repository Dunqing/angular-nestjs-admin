import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(
    private readonly systemService: SystemService
  ) {}

  @Get('backupMongoDb')
  backupMongodb() {
    return this.systemService.backupMongodb()
  }

  @Get('restoreMongoDb')
  restoreMongodb() {
    return this.systemService.restoreMongodb()
  }
}
