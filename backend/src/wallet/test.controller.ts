import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { WalletService } from './wallet.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly walletService: WalletService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Post('airdrop')
  async airdrop(@Body() body: { email: string; amount: number }) {
    const user = await this.databaseService.findUserByEmail(body.email);
    if (!user) {
      throw new NotFoundException(`User with email ${body.email} not found`);
    }

    return this.walletService.airdrop(user.email, body.amount);
  }
}
