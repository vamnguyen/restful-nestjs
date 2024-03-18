import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';

@Injectable({}) // This is dependency injection
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(authDTO: AuthDTO) {
    // Hash the password
    const hashedPassword = await argon.hash(authDTO.password);
    try {
      // Save the user to the database
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword,
          firstName: '',
          lastName: '',
        },
        // Only return the id, email, firstName, lastName and createdAt of the user
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already exists');
      }
    }
  }

  async login(authDTO: AuthDTO) {
    // find user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
      },
    });

    // If the user is not found, throw an error
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Compare the password
    const isPasswordValid = await argon.verify(
      user.hashedPassword,
      authDTO.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }

    return user;
  }
}
