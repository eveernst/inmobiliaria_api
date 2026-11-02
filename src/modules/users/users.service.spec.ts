import { ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { User } from './entities/user.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';

describe('UsersService', () => {
  let txManager: { delete: jest.Mock };
  let repository: {
    findOne: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    manager: { transaction: jest.Mock };
  };
  let service: UsersService;

  beforeEach(() => {
    txManager = { delete: jest.fn() };
    repository = {
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      manager: {
        transaction: jest.fn((work) => work(txManager)),
      },
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
      expect(repository.manager.transaction).not.toHaveBeenCalled();
      expect(txManager.delete).not.toHaveBeenCalled();
    });

    it('deletes a superuser when another one exists', async () => {
      repository.findOne.mockResolvedValue({ id: 1, role: UserRole.SUPERUSER });
      repository.count.mockResolvedValue(2);

      await service.remove(1);

      expect(txManager.delete).toHaveBeenCalledWith(User, 1);
    });

    it('deletes a non-superuser without counting superusers', async () => {
      repository.findOne.mockResolvedValue({ id: 2, role: UserRole.ADMIN });

      await service.remove(2);

      expect(repository.count).not.toHaveBeenCalled();
      expect(txManager.delete).toHaveBeenCalledWith(User, 2);
    });

    it("deletes the user's notifications", async () => {
      repository.findOne.mockResolvedValue({ id: 2, role: UserRole.ADMIN });

      await service.remove(2);

      expect(txManager.delete).toHaveBeenCalledWith(Notification, {
        user: { id: 2 },
      });
    });

    it('rejects deleting a user that still has assigned properties', async () => {
      repository.findOne.mockResolvedValue({
        id: 2,
        role: UserRole.ADMIN,
        property: [{ id: 10 }],
      });

      await expect(service.remove(2)).rejects.toBeInstanceOf(ConflictException);
      expect(repository.manager.transaction).not.toHaveBeenCalled();
      expect(txManager.delete).not.toHaveBeenCalled();
    });

    it('deletes notifications and the user in one transaction, user last', async () => {
      repository.findOne.mockResolvedValue({ id: 2, role: UserRole.ADMIN });

      await service.remove(2);

      expect(repository.manager.transaction).toHaveBeenCalledTimes(1);
      expect(repository.delete).not.toHaveBeenCalled();
      expect(txManager.delete).toHaveBeenNthCalledWith(1, Notification, {
        user: { id: 2 },
      });
      expect(txManager.delete).toHaveBeenNthCalledWith(2, User, 2);
    });

    it('propagates a failure inside the transaction so it rolls back', async () => {
      repository.findOne.mockResolvedValue({ id: 2, role: UserRole.ADMIN });
      txManager.delete.mockRejectedValueOnce(new Error('db down'));

      await expect(service.remove(2)).rejects.toThrow('db down');
      expect(txManager.delete).not.toHaveBeenCalledWith(User, 2);
    });

    it('keeps deleting a missing user as a no-op instead of crashing', async () => {
      repository.findOne.mockResolvedValue(null);

      await service.remove(99);

      expect(txManager.delete).toHaveBeenCalledWith(User, 99);
    });
  });
});
