import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstallationService } from './installation.service';
import { InstallationController } from './installation.controller';
import { Installation } from './entities/installation.entity';
import { Classification } from '../classification/entities/classification.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    TypeOrmModule.forFeature([Installation, Classification]),
  ],
  controllers: [InstallationController],
  providers: [InstallationService],
})
export class InstallationModule {}
