import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BASE_URL } from '@config/api';
import express from 'express';

@Controller(`${BASE_URL}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; passConfirm: string },
    @Res() res: express.Response,
  ) {
    const token = await this.authService.register(
      body.email,
      body.password,
      body.passConfirm,
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
    });

    // return res.status(201).json({ token });
    return { message: '회원가입 성공' };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: express.Response) {
    const token = await this.authService.login(body.email, body.password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
    });

    // return res.status(201).json({ token });
    return { message: '로그인 성공' };
  }
}
