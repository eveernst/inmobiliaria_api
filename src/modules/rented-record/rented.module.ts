import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RentedService } from "./rented.service";
import { RentedController } from "./rented.controller";
import { Rented } from "./entities/rented.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Rented])],
  controllers: [RentedController],
  providers: [RentedService],
})
export class RentedModule {}