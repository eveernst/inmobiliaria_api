import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../shared/enums/user-role.enum';

async function bootstrap() {
  const email = process.env.SUPERUSER_EMAIL;
  const password = process.env.SUPERUSER_PASSWORD;
  const name = process.env.SUPERUSER_NAME || 'Superuser';

  if (!email || !password) {
    console.error(
      'Faltan SUPERUSER_EMAIL y/o SUPERUSER_PASSWORD. Definilas en .env o como variables de entorno antes de correr el seed.',
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const existing = await usersService.findByEmail(email);
    if (existing) {
      console.log(
        `Ya existe un usuario con email ${email} (id ${existing.id}, role ${existing.role}). No se creó nada.`,
      );
      return;
    }

    const superuser = await usersService.create({
      name,
      email,
      password,
      role: UserRole.SUPERUSER,
    });

    console.log(
      `Superusuario creado: id ${superuser.id}, email ${superuser.email}.`,
    );
  } finally {
    await app.close();
  }
}

bootstrap();
