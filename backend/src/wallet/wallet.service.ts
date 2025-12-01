import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class WalletService {
  constructor(
    private databaseService: DatabaseService,
    private eventsGateway: EventsGateway,
  ) {}

  async getBalance(userId: string) {
    const wallet = await this.databaseService.findWalletByUserEmail(userId);
    return wallet ? wallet.balance : 0;
  }

  async getPortfolio(userId: string) {
    const wallet = await this.databaseService.findWalletByUserEmail(userId);

    if (!wallet) return { balance: 0, holdings: [] };

    const transactions = await this.databaseService.findTransactionsByWalletId(wallet.id);

    // 트랜잭션을 기반으로 보유 코인 계산
    const holdings = transactions.reduce((acc, tx) => {
      if (!acc[tx.coinId]) {
        acc[tx.coinId] = { amount: 0, totalCost: 0 };
      }
      
      if (tx.type === 'BUY') {
        acc[tx.coinId].amount += tx.amount;
        acc[tx.coinId].totalCost += tx.amount * tx.price;
      } else {
        acc[tx.coinId].amount -= tx.amount;
        if (acc[tx.coinId].amount > 0) {
           const avgPrice = acc[tx.coinId].totalCost / (acc[tx.coinId].amount + tx.amount);
           acc[tx.coinId].totalCost = avgPrice * acc[tx.coinId].amount;
        } else {
           acc[tx.coinId].totalCost = 0;
        }
      }
      return acc;
    }, {} as Record<string, { amount: number; totalCost: number }>);

    return {
      balance: wallet.balance,
      holdings: Object.entries(holdings).map(([coinId, data]) => ({
        coinId,
        amount: data.amount,
        averagePrice: data.amount > 0 ? data.totalCost / data.amount : 0,
      })).filter(h => h.amount > 0),
    };
  }

  async buyCoin(userEmail: string, coinId: string, amount: number, price: number) {
    const totalCost = amount * price;
    
    // In-memory transaction simulation (not truly atomic but sufficient for this demo)
    const wallet = await this.databaseService.findWalletByUserEmail(userEmail);

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (wallet.balance < totalCost) {
      throw new BadRequestException('Insufficient balance');
    }

    const newBalance = wallet.balance - totalCost;
    await this.databaseService.updateWalletBalance(wallet.id, newBalance);

    const transaction = await this.databaseService.createTransaction({
      walletId: wallet.id,
      coinId,
      amount,
      price,
      type: 'BUY',
    });

    // Send real-time update
    this.eventsGateway.sendWalletUpdate(userEmail, newBalance);

    return { newBalance, transaction };
  }

  async sellCoin(userEmail: string, coinId: string, amount: number, price: number) {
    const totalValue = amount * price;

    const wallet = await this.databaseService.findWalletByUserEmail(userEmail);

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    const transactions = await this.databaseService.findTransactionsByWalletId(wallet.id);

    // Check if user has enough coin
    const currentHoldings = transactions.reduce((acc, tx) => {
      if (tx.coinId === coinId) {
        if (tx.type === 'BUY') acc += tx.amount;
        else acc -= tx.amount;
      }
      return acc;
    }, 0);

    if (currentHoldings < amount) {
      throw new BadRequestException('Insufficient coin balance');
    }

    const newBalance = wallet.balance + totalValue;
    await this.databaseService.updateWalletBalance(wallet.id, newBalance);

    const transaction = await this.databaseService.createTransaction({
      walletId: wallet.id,
      coinId,
      amount,
      price,
      type: 'SELL',
    });

    this.eventsGateway.sendWalletUpdate(userEmail, newBalance);

    return { newBalance, transaction };
  }

  async airdrop(userId: string, amount: number) {
    const wallet = await this.databaseService.findWalletByUserEmail(userId);
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    const newBalance = wallet.balance + amount;
    await this.databaseService.updateWalletBalance(wallet.id, newBalance);
    
    // Create a transaction record for the airdrop (optional, but good for history)
    await this.databaseService.createTransaction({
      walletId: wallet.id,
      coinId: 'USDT',
      amount: amount,
      price: 1, // 1:1 for USDT
      type: 'BUY', // Treat as buy or maybe add DEPOSIT type later, but BUY is fine for now
    });

    this.eventsGateway.sendWalletUpdate(userId, newBalance);
    return { newBalance };
  }
}
