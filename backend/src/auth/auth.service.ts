import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async register(email: string, password: string, passConfirm: string) {
    const exists = await this.users.findOne({ where: { email } });
    if (exists) throw new UnauthorizedException('이미 가입된 이메일입니다.');
    if (password !== passConfirm)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const hashed = await bcrypt.hash(password, 12);
    const user = this.users.create({ email, password: hashed });
    await this.users.save(user);
    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    return this.generateToken(user);
  }

  generateToken(user: User) {
    return this.jwtService.sign({ id: user.id, email: user.email, role: user.role }, { expiresIn: '1h' });
  }
}
