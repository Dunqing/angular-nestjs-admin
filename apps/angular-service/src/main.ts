/*
 * @Author: your name
 * @Date: 2020-06-26 23:55:01
 * @LastEditTime: 2020-06-30 17:52:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \angular-nestjs-admin\apps\angular-service\src\main.ts
 */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/admin/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('angular-nestjs-admin')
    .setDescription('angular通用后台')
    .setVersion('1.0')
    .addTag('angular-nestjs-admin')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const ip = 'http://127.0.0.1';
  const port = process.env.ELS_PORT || 3302;
  console.log(`${ip}:${port}/api-doc`, '文档地址');

  await app.listen(3000);
}
bootstrap();
