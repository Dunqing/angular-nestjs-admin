import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('dictionary')
@Controller('dictionary')
export class DictionaryController {
  @Get('list')
  types() {
    return {};
  }
}

@ApiBearerAuth()
@ApiTags('dictionary')
@Controller('dictionary/type')
export class DictionaryTypeController {
  @Get('list')
  types() {
    return {};
  }
}
