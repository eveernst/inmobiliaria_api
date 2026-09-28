import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WritingService } from './writing.service';
import { Writing } from './entities/writing.entity';
import { CreateWritingDto } from './dtos/create-writing.dto';
import { ReadWritingDto } from './dtos/read-writing.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('writing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @Get()
  findAll(): Promise<Writing[]> {
    return this.writingService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponse<ReadWritingDto>> {
    const writing = await this.writingService.findOne(id);
    const response = plainToClass(ReadWritingDto, writing);
    return new GenericResponse<ReadWritingDto>(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() writingData: CreateWritingDto): Promise<Writing> {
    return this.writingService.create(writingData);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: number,
    @Body() writingData: Partial<Writing>,
  ): Promise<Writing> {
    return this.writingService.update(id, writingData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.writingService.remove(id);
  }
}
