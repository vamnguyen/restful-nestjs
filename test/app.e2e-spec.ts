/**
 * How to open prisma studio on "TEST" database?
 * run `npx dotenv -e .env.test prisma studio`
 * Similarly, we open prism studio on "DEV" database by running `npx dotenv -e .env prisma studio`
 */

import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

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

    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should Register', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'abc123@gmail.com',
            password: 'abc123',
            firstName: 'Minh',
            lastName: 'Nguyen',
          })
          .expectStatus(201);
        // .inspect();
      });

      it('should show error with empty email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: '',
            password: 'abc123',
            firstName: 'Minh',
            lastName: 'Nguyen',
          })
          .expectStatus(400);
      });

      it('should show error with invalid email format', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'minhgmail',
            password: 'abc123',
            firstName: 'Minh',
            lastName: 'Nguyen',
          })
          .expectStatus(400);
      });
    });

    describe('Login', () => {
      it('should Login', () => {
        return (
          pactum
            .spec()
            .post(`/auth/login`)
            .withBody({
              email: 'abc123@gmail.com',
              password: 'abc123',
            })
            .expectStatus(201)
            // .inspect()
            .stores('accessToken', 'accessToken')
        );
      });

      it('should show error if empty password', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: 'abc123@gmail.com',
            password: '',
          })
          .expectStatus(400);
      });
    });

    describe('User Info', () => {
      it('should get user info', () => {
        return pactum
          .spec()
          .get(`/users/me`)
          .withHeaders({
            Authorization: `Bearer $S{accessToken}`,
          })
          .expectStatus(200);
      });
    });
  });

  afterAll(async () => {
    app.close();
  });

  it.todo('should return Hello World!');
  it.todo('should return Minh dep trai!');
});
