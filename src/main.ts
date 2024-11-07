import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // Permite solicitudes solo desde este origen
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type,Authorization', // Headers permitidos
  });

  await app.listen(3000);
}
bootstrap();
