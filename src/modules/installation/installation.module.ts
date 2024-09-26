import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InstallationService } from "./installation.service";
import { InstallationController } from "./installation.controller";
import { Installation } from "./entities/installation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Installation])],
  controllers: [InstallationController],
  providers: [InstallationService],
})
export class InstallationModule {}
