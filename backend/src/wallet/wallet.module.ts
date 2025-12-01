import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [DatabaseModule, EventsModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
