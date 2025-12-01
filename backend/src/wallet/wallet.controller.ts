import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.email);
  }

  @Get('portfolio')
  async getPortfolio(@Request() req) {
    return this.walletService.getPortfolio(req.user.email);
  }

  @Post('buy')
  async buyCoin(@Request() req, @Body() body: { coinId: string; amount: number; price: number }) {
    return this.walletService.buyCoin(req.user.email, body.coinId, body.amount, body.price);
  }

  @Post('sell')
  async sellCoin(@Request() req, @Body() body: { coinId: string; amount: number; price: number }) {
    return this.walletService.sellCoin(req.user.email, body.coinId, body.amount, body.price);
  }
}
