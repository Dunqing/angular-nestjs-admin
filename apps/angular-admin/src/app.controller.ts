/*
 * @Author: your name
 * @Date: 2020-06-26 23:55:01
 * @LastEditTime: 2020-06-30 17:59:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \angular-nestjs-admin\apps\angular-admin\src\app.controller.ts
 */ 
import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return {
      url: file.path
    }
  }
}
