import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from 'src/shared/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    if (userData.role !== undefined && userData.role !== UserRole.SUPERUSER) {
      await this.assertNotLastSuperuser(id);
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  private async assertNotLastSuperuser(id: number): Promise<void> {
    const current = await this.findOne(id);
    if (!current || current.role !== UserRole.SUPERUSER) {
      return;
    }

    const superuserCount = await this.usersRepository.count({
      where: { role: UserRole.SUPERUSER },
    });
    if (superuserCount <= 1) {
      throw new ForbiddenException(
        'La operación dejaría al sistema sin ningún superusuario.',
      );
    }
  }

  // Both FKs to user are ON DELETE NO ACTION. Per CU 1.3.2 a user with
  // properties can't be deleted until they're reassigned; notifications are
  // personal, so they're deleted along with the user.
  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['property'],
    });
    if (user?.property?.length) {
      throw new ConflictException(
        `El usuario tiene ${user.property.length} propiedad(es) asignada(s). Reasignalas antes de eliminarlo.`,
      );
    }
    await this.assertNotLastSuperuser(id);
    await this.usersRepository.manager.transaction(async (manager) => {
      await manager.delete(Notification, { user: { id } });
      await manager.delete(User, id);
    });
  }
}
