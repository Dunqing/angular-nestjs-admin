import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('设备租赁')
    .setDescription('设备租赁小程序')
    .setVersion('1.0')
    .addTag('equipment-leasing-admin')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const ip = 'http://127.0.0.1';
  const port = process.env.ELS_PORT || 3302;
  console.log(`${ip}:${port}/api-doc`, '文档地址');
  
  await app.listen(3000);
}
bootstrap();
