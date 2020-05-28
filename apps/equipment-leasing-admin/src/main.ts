import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from 'libs/pipes/validation.pipe';
import { ErrorExceptionsFilter } from './filters/errors.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api')
  app.enableCors()
  
  app.useGlobalFilters(new ErrorExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ErrorsInterceptor(new Reflector()),
    new ResponseInterceptor(new Reflector()),
    new LoggingInterceptor(),
  );
  app.useStaticAssets('upload', {
    prefix: '/upload'
  })

  const options = new DocumentBuilder()
    .setTitle('设备租赁')
    .setDescription('设备租赁后台')
    .setVersion('1.0')
    .addTag('equipment-leasing-admin')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  const port = process.env.ELA_PORT || 3301;
  const ip = 'http://127.0.0.1:' + port;
  console.log(`${ip}/api-doc`, '文档地址');
  await app.listen(port);
}
bootstrap();
