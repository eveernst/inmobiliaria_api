import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from 'src/shared/enums/user-role.enum';

describe('UsersController', () => {
  const entity = Object.assign(new User(), {
    id: 4,
    name: 'Ana',
    email: 'ana@example.com',
    password: 'hashed-secret',
    role: UserRole.ADMIN,
    createdAt: new Date('2026-09-28T00:00:00Z'),
    updatedAt: new Date('2026-09-28T00:00:00Z'),
  });
  const expected = {
    id: 4,
    name: 'Ana',
    email: 'ana@example.com',
    role: UserRole.ADMIN,
  };

  let service: { findAll: jest.Mock; findOne: jest.Mock };
  let controller: UsersController;

  beforeEach(() => {
    service = { findAll: jest.fn(), findOne: jest.fn() };
    controller = new UsersController(service as unknown as UsersService);
  });

  describe('findAll', () => {
    it('returns each user with its id, which the client needs for PUT/DELETE', async () => {
      service.findAll.mockResolvedValue([entity]);

      const result = await controller.findAll();

      expect(result).toEqual([expected]);
    });

    it('never returns the password hash', async () => {
      service.findAll.mockResolvedValue([entity]);

      const [user] = await controller.findAll();

      expect(user).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('returns the user with its id and without the password hash', async () => {
      service.findOne.mockResolvedValue(entity);

      const result = await controller.findOne(4);

      expect(result.data).toEqual(expected);
      expect(result.data).not.toHaveProperty('password');
    });
  });
});
