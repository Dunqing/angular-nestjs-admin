import { Controller, Get, Post, UseGuards, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DictionaryService } from './dictionary.service';
import { HttpProcessor } from '../../decorators/http.decorator';
import { JwtAuthGuard } from '../user/passport/jwt.guard';
import { QueryParams } from '../../decorators/query-params.decorator';
import { Dictionary, DictionaryType, DelDictionaryTypes, DelDictionary } from './dictionary.model';
import { PermissionNamePrefix, PermissionIdentifier } from '../../decorators/permission.decorator';
import { NamePrefix, Identifier } from '../../interfaces/permission.interface';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('dictionary')
@Controller('dictionary')
@PermissionNamePrefix(NamePrefix.Dictionary)
export class DictionaryController {
  constructor(private dictionaryService: DictionaryService) {}

  @PermissionIdentifier(Identifier.ADD)
  @HttpProcessor.handle({ message: '创建字典标签' })
  @Post()
  create(@Body() body: Dictionary): Promise<Dictionary> {
    // throw new Error();
    return this.dictionaryService.createDictionary(body);
  }

  @PermissionIdentifier(Identifier.EDIT)
  @HttpProcessor.handle('修改字典标签')
  @Put(':id')
  updateType(@QueryParams() { params }, @Body() body: any) {
    return this.dictionaryService.updateDictionary(params.id, body)
  }

  @PermissionIdentifier(Identifier.DEL)
  @HttpProcessor.handle('删除字典标签')
  @Delete()
  delTypes(@Body() body: DelDictionary) {
    return this.dictionaryService.delDictionary(body.dictionaryIds)
  }

}

// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('dictionary')
@Controller('dictionary/type')
@UseGuards(JwtAuthGuard)
@PermissionNamePrefix(NamePrefix.DictionaryType)
export class DictionaryTypeController {
  constructor(private dictionaryService: DictionaryService) {}

  @PermissionIdentifier(Identifier.ADD)
  @HttpProcessor.handle({ message: '创建字典类型' })
  @Post()
  create(@Body() body: DictionaryType): Promise<DictionaryType> {
    return this.dictionaryService.createDictType(body);
  }

  @PermissionIdentifier(Identifier.READ)
  @HttpProcessor.handle({ message: '获取所有字典类型' })
  @Get('list')
  getList(): Promise<any> {
    return this.dictionaryService.getTypeList();
  }

  @PermissionIdentifier(Identifier.READ)
  @HttpProcessor.handle({ usePaginate: true, message: '获取字典列表' })
  @Get('pagination')
  typeList(@QueryParams() { querys, options }): Promise<any> {
    return this.dictionaryService.getTypePagination(querys, options);
  }

  /**
   * 用类型名获取全部该类型全部标签
   */
  @PermissionIdentifier(Identifier.READ)
  @HttpProcessor.handle('获取类型对应所有标签')
  @Get(':name')
  typeLabels(@QueryParams() { params }): Promise<Dictionary[]> {
    return this.dictionaryService.getTypeLabels(params.name);
  }

  @PermissionIdentifier(Identifier.EDIT)
  @HttpProcessor.handle('修改字典类型')
  @Put(':id')
  updateType(@QueryParams() { params }, @Body() body: any) {
    return this.dictionaryService.updateDictionaryType(params.id, body)
  }

  @PermissionIdentifier(Identifier.DEL)
  @HttpProcessor.handle('删除字典类型')
  @Delete()
  delTypes(@Body() body: DelDictionaryTypes) {
    return this.dictionaryService.delDictionaryType(body.dictionaryTypeIds)
  }
}
