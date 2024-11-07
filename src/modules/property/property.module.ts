import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Property } from "./entities/property.entity";
import { PropertyService } from "./property.service";
import { PropertyController } from "./property.controller";
import { Classification } from "../classification/entities/classification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Property,
    Classification
  ])],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}