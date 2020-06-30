import { Controller, Post, Body } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './configuration.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Config')
@Controller('config')
export class ConfigurationController {
  constructor(private configurationService: ConfigurationService) {}

  @Post()
  create(@Body() body: Configuration) {
    return this.configurationService.create(body);
  }
}
