import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService, LoginUser } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }):Promise<{access_token: string; user: LoginUser}> {
    console.log('📌 Login request body:', body);

    const user = await this.authService.validateUser(body.email, body.password);

    console.log('📌 validateUser result:', user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.login(user);
  }
}
