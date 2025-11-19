import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [EventsModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
