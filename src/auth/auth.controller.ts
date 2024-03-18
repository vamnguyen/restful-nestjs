import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  // The AuthService is automatically created when initializing the AuthController
  constructor(private authService: AuthService) {}

  // some requests from client
  @Post('register')
  register(@Body() authDTO: AuthDTO) {
    return this.authService.register(authDTO);
  }

  @Post('login')
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }
}
