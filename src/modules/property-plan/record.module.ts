import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Record } from "./entities/record.entity";
import { RecordService } from "./record.service";
import { RecordController } from "./record.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}