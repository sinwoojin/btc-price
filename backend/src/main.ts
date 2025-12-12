import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || '').split(',').filter(Boolean)
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : 'http://localhost:3000',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
  Logger.log(`Server listening on port ${process.env.PORT ?? 3001}`, 'NestApplication');
  Logger.log(`CORS enabled for: ${allowedOrigins.join(', ')}`, 'NestApplication');
}
bootstrap();
