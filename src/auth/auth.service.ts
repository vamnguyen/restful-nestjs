import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTOLogin, AuthDTORegister } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({}) // This is dependency injection
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDTO: AuthDTORegister) {
    // Hash the password
    const hashedPassword = await argon.hash(authDTO.password);
    try {
      // Save the user to the database
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword,
          firstName: authDTO.firstName,
          lastName: authDTO.lastName,
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
      // Convert the user to a JWT
      return await this.signJWT(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already exists');
      }
    }
  }

  async login(authDTO: AuthDTOLogin) {
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
    delete user.hashedPassword;

    // Convert the user to a JWT
    return await this.signJWT(user.id, user.email);
  }

  async signJWT(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: jwtString,
    };
  }
}
