import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WritingService } from "./writing.service";
import { WritingController } from "./writing.controller";
import { Writing } from "./entities/writing.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Writing])],
  controllers: [WritingController],
  providers: [WritingService],
})
export class WritingModule {}