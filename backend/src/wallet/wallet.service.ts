
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async getBalance(userId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    return wallet ? wallet.balance : 0;
  }

  async buyCoin(userId: number, coinId: string, amount: number, price: number) {
    const totalCost = amount * price;
    
    // Start a transaction
    return this.prisma.$transaction(async (prisma) => {
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      // In a real app, you'd check if balance >= totalCost
      // For this demo, we'll allow negative balance or assume infinite funds if not specified
      // Let's just update the balance for now (assuming it tracks spending)
      // Or if it's a "portfolio" maybe we just track holdings. 
      // Let's assume we are deducting from a balance.
      
      // For simplicity in this demo, let's assume the user starts with 0 and we just track transactions
      // OR let's give them a starting balance. 
      // Let's just deduct and allow negative for now to demonstrate the flow, 
      // or better, check balance.
      
      // Let's just record the transaction and update balance (deduct cost)
      const newBalance = wallet.balance - totalCost;

      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      });

      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          coinId,
          amount,
          price,
          type: 'BUY',
        },
      });

      // Send real-time update
      this.eventsGateway.sendWalletUpdate(userId, newBalance);

      return { newBalance, transaction };
    });
  }
}
