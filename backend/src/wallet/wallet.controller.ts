import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.userId);
  }

  @Post('buy')
  async buyCoin(@Request() req, @Body() body: { coinId: string; amount: number; price: number }) {
    return this.walletService.buyCoin(req.user.userId, body.coinId, body.amount, body.price);
  }
}
