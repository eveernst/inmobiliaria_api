import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

// Replaces JWT validation with a fake that reads the caller's role from a
// header, so the real RolesGuard decides access without a database or token.
const fakeJwtGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1, role: Number(req.headers['x-test-role']) };
    return true;
  },
};

describe('UsersController access', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(fakeJwtGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe.each([
    ['GET /users', '/users'],
    ['GET /users/:id', '/users/1'],
  ])('%s', (_label, path) => {
    it('rejects a viewer with 403', async () => {
      await request(app.getHttpServer())
        .get(path)
        .set('x-test-role', String(UserRole.VIEWER))
        .expect(403);
    });

    it.each([
      ['admin', UserRole.ADMIN],
      ['superuser', UserRole.SUPERUSER],
    ])('allows an %s with 200', async (_name, role) => {
      await request(app.getHttpServer())
        .get(path)
        .set('x-test-role', String(role))
        .expect(200);
    });
  });
});
