import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService, User } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const existingUser = await this.databaseService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.databaseService.createUser({
      email,
      password: hashedPassword,
      name,
    });

    // Give initial balance (5,000,000 USDT)
    await this.databaseService.createWallet(user.email, 5000000);

    return { message: 'User created successfully' };
  }

  async validateUser(email: string, pass: string): Promise<{id:number; email: string; name?: string} | null> {
    const user = await this.databaseService.findUserByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
