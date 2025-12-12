import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Log environment variables for debugging
  Logger.log(`NODE_ENV: ${process.env.NODE_ENV}`, 'Bootstrap');
  Logger.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`, 'Bootstrap');
  
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || '').split(',').filter(Boolean)
    : ['http://localhost:3000'];
  
  Logger.log(`Allowed origins: ${JSON.stringify(allowedOrigins)}`, 'Bootstrap');
  
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  Logger.log(`Server listening on port ${port}`, 'Bootstrap');
  Logger.log(`CORS enabled for: ${allowedOrigins.join(', ')}`, 'Bootstrap');
}

bootstrap();
