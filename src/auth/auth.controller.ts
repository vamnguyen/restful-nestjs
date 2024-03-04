import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  // The AuthService is automatically created when initializing the AuthController
  constructor(private authService: AuthService) {}

  // some requests from client
  @Post('register')
  register(@Body() body: any) {
    console.log(body);
    return this.authService.register();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
