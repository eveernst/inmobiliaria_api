import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanService } from "./plan.service";
import { PlanController } from "./plan.controller";
import { Plan } from "./entities/plan.entity";
import { Property } from "../property/entities/property.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Plan, Property])],
    controllers: [PlanController],
    providers: [PlanService],
})
export class PlanModule {}