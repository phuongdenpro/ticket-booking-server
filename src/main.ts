import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  utilities,
  WinstonModule,
} from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as winston from 'winston';
import * as morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('API'),
      ),
    }),
    cors: true,
  });
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  const isDev = configService.get('NODE_ENV', 'production') === 'development';

  app.use(
    morgan(':remote-addr - :method :url :status', {
      stream: {
        write: (message) => logger.log(message.trim(), 'Request'),
      },
    }),
    helmet(
      isDev
        ? {
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginOpenerPolicy: false,
            crossOriginResourcePolicy: false,
          }
        : {},
    ),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Ticket book')
    .setDescription('The ticket API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT' })
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT' }, 'refresh')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  logger.log(`listening at http://localhost:${PORT}/api`, 'Server');
}

bootstrap();
