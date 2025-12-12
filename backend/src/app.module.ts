import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [DatabaseModule, AuthModule, WalletModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
