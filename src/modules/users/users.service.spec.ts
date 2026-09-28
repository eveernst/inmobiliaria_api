import { ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/shared/enums/user-role.enum';

describe('UsersService', () => {
  let repository: {
    findOne: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let service: UsersService;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new UsersService(repository as any);
  });

  describe('update', () => {
    it('rejects demoting the only superuser', async () => {
      repository.findOne.mockResolvedValue({ id: 1, role: UserRole.SUPERUSER });
      repository.count.mockResolvedValue(1);

      await expect(
        service.update(1, { role: UserRole.ADMIN }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('allows demoting a superuser when another one exists', async () => {
      repository.findOne.mockResolvedValue({ id: 1, role: UserRole.SUPERUSER });
      repository.count.mockResolvedValue(2);

      await service.update(1, { role: UserRole.ADMIN });

      expect(repository.update).toHaveBeenCalledWith(1, {
        role: UserRole.ADMIN,
      });
    });
  });

  describe('remove', () => {
    it('rejects deleting the only superuser', async () => {
      repository.findOne.mockResolvedValue({ id: 1, role: UserRole.SUPERUSER });
      repository.count.mockResolvedValue(1);

      await expect(service.remove(1)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('deletes a superuser when another one exists', async () => {
      repository.findOne.mockResolvedValue({ id: 1, role: UserRole.SUPERUSER });
      repository.count.mockResolvedValue(2);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('deletes a non-superuser without counting superusers', async () => {
      repository.findOne.mockResolvedValue({ id: 2, role: UserRole.ADMIN });

      await service.remove(2);

      expect(repository.count).not.toHaveBeenCalled();
      expect(repository.delete).toHaveBeenCalledWith(2);
    });

    it('keeps deleting a missing user as a no-op instead of crashing', async () => {
      repository.findOne.mockResolvedValue(null);

      await service.remove(99);

      expect(repository.delete).toHaveBeenCalledWith(99);
    });
  });
});
