import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // this makes the PrismaService available to the entire application
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // other modules can use the PrismaService
})
export class PrismaModule {}
