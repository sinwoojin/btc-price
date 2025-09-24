import 'dotenv/config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: Number(process.env.MARIA_PORT) || 4406,
      username: process.env.MARIA_USER || 'root',
      password: process.env.MARIA_PASSWORD || 'password',
      database: 'auth',
      entities: [User],
      synchronize: true, // 개발용
    }),
    AuthModule,
  ],
})
export class AppModule {}
