import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTOLogin, AuthDTORegister } from './dto';

@Controller('auth')
export class AuthController {
  // The AuthService is automatically created when initializing the AuthController
  constructor(private authService: AuthService) {}

  // some requests from client
  @Post('register')
  register(@Body() authDTO: AuthDTORegister) {
    return this.authService.register(authDTO);
  }

  @Post('login')
  login(@Body() authDTO: AuthDTOLogin) {
    return this.authService.login(authDTO);
  }
}
