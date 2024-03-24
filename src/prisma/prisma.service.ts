import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          // url: process.env.DATABASE_URL,
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDatabase() {
    // In a 1 - N relationship, delete "N" firstly, then delete "1"
    return this.$transaction([
      // Only 1 in all below command be executed fails, the transaction will be rolled back
      this.note.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
