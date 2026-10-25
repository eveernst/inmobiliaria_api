import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstallationService } from './installation.service';
import { InstallationController } from './installation.controller';
import { Installation } from './entities/installation.entity';
import { NotificationModule } from '../notification/notification.module';
import { Property } from '../property/entities/property.entity';

@Module({
  imports: [
    NotificationModule,
    TypeOrmModule.forFeature([Installation, Property]),
  ],
  controllers: [InstallationController],
  providers: [InstallationService],
})
export class InstallationModule {}
