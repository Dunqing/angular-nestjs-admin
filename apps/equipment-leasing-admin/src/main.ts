import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from 'libs/pipes/validation.pipe';
import { ErrorExceptionsFilter } from './filters/errors.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ErrorExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ErrorsInterceptor(new Reflector()),
    new ResponseInterceptor(new Reflector()),
  );

  const options = new DocumentBuilder()
    .setTitle('设备租赁')
    .setDescription('设备租赁后台')
    .setVersion('1.0')
    .addTag('equipment-leasing-admin')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  const ip = 'http://127.0.0.1';
  const port = process.env.ELA_PORT || 3301;
  console.log(`${ip}:${port}/api-doc`, '文档地址');
  
  await app.listen(port);
}
bootstrap();
