import { Injectable } from '@nestjs/common';
@Injectable({}) // This is dependency injection
export class AuthService {
  register() {
    return {
      message: 'Register new user',
      name: 'John Doe',
      email: 'john@gmail.com',
    };
  }

  login() {
    return 'Login...';
  }
}
