import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable({}) // This is dependency injection
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  register() {
    return {
      message: 'Register new user',
    };
  }

  login() {
    return 'Login...';
  }
}
