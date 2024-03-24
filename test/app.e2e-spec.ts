/**
 * How to open prisma studio on "TEST" database?
 * run `npx dotenv -e .env.test prisma studio`
 * Similarly, we open prism studio on "DEV" database by running `npx dotenv -e .env prisma studio`
 */

import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

const PORT = 3002; // This is PORT for testing purpose only.

describe('App End2End tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);

    prismaService = app.get(PrismaService);
    await prismaService.cleanDatabase();
  });

  afterAll(async () => {
    app.close();
  });

  it.todo('should return Hello World!');
  it.todo('should return Minh dep trai!');
});
