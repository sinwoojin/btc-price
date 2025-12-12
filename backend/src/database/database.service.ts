import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
}

export interface Wallet {
  id: number;
  userEmail: string;
  balance: number;
}

export interface Transaction {
  id: number;
  walletId: number;
  coinId: string;
  amount: number;
  price: number;
  type: 'BUY' | 'SELL';
  createdAt: Date;
}

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private wallets: Wallet[] = [];
  private transactions: Transaction[] = [];

  private userIdCounter = 1;
  private walletIdCounter = 1;
  private transactionIdCounter = 1;

  // User Methods
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async createUser(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    const user: User = {
      id: this.userIdCounter++,
      email: data.email,
      password: data.password,
      name: data.name,
    };
    this.users.push(user);
    return user;
  }

  // Wallet Methods
  async createWallet(
    userEmail: string,
    initialBalance: number = 5000000,
  ): Promise<Wallet> {
    const wallet: Wallet = {
      id: this.walletIdCounter++,
      userEmail,
      balance: initialBalance,
    };
    this.wallets.push(wallet);
    return wallet;
  }

  async findWalletByUserEmail(userEmail: string): Promise<Wallet | undefined> {
    return this.wallets.find((w) => w.userEmail === userEmail);
  }

  async updateWalletBalance(
    walletId: number,
    newBalance: number,
  ): Promise<Wallet> {
    const wallet = this.wallets.find((w) => w.id === walletId);
    if (wallet) {
      wallet.balance = newBalance;
    }
    return wallet!;
  }

  // Transaction Methods
  async createTransaction(data: {
    walletId: number;
    coinId: string;
    amount: number;
    price: number;
    type: 'BUY' | 'SELL';
  }): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.transactionIdCounter++,
      ...data,
      createdAt: new Date(),
    };
    this.transactions.push(transaction);
    return transaction;
  }

  async findTransactionsByWalletId(walletId: number): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.walletId === walletId);
  }
}
