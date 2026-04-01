import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyModule } from './modules/property/property.module';
import { InstallationModule } from './modules/installation/installation.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { InsuranceModule } from './modules/insurance-record/insurance.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlanModule } from './modules/plan-record/plan.module';
import { RentedModule } from './modules/rented-record/rented.module';
import { WritingModule } from './modules/writing-record/writing.module';

@Module({
  imports: [
    // DevtoolsModule.register({
    //     // http: process.env.NODE_ENV !== 'production',
    //     http: true,
    //   }),
    NestConfig.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    NotificationModule,
    UsersModule,
    AuthModule,
    PropertyModule,
    InstallationModule,
    ClassificationModule,
    InsuranceModule,
    PlanModule,
    RentedModule,
    WritingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
