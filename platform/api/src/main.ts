import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: config.get<string[]>('corsOrigins'),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Stripe-style API prefix
  app.setGlobalPrefix('v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GasFree Payments API')
    .setDescription(
      'Production wallet & payments API. Ledger: Formance. Auth: SIWE. Resource model inspired by Stripe.',
    )
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (config.get('nodeEnv') !== 'production') {
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.get<number>('port') || 3001;
  await app.listen(port);
  console.log(`Platform API listening on http://localhost:${port}`);
  console.log(`OpenAPI docs: http://localhost:${port}/docs`);
}

bootstrap();
