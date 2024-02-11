import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import {
  AllExceptionsFilter,
  validationAndErrorFormatterPipe,
} from '@libs/error-handler';
import { LoggerService } from '@libs/logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors();
  app.enableVersioning();

  app.useGlobalPipes(validationAndErrorFormatterPipe);

  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost), new LoggerService()),
  );

  const config = new DocumentBuilder()
    .setTitle(configService.get('appName'))
    .setVersion(configService.get('appVersion'))
    .setDescription(configService.get('appDescription'))
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('port'));
}
bootstrap();
