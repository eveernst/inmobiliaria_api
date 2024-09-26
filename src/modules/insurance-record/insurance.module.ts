import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InsuranceService } from "./insurance.service";
import { InsuranceController } from "./insurance.controller";
import { Insurance } from "./entities/insurance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Insurance])],
  controllers: [InsuranceController],
  providers: [InsuranceService],
})
export class InsuranceModule {}