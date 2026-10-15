import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { WritingService } from './writing.service';
import { CreateWritingDto } from './dtos/create-writing.dto';
import { UpdateWritingDto } from './dtos/update-writing.dto';
import { ReadWritingDto } from './dtos/read-writing.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('writing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @Get()
  async findAll(): Promise<ReadWritingDto[]> {
    const items = await this.writingService.findAll();
    return plainToInstance(ReadWritingDto, items, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponse<ReadWritingDto>> {
    const writing = await this.writingService.findOne(id);
    const response = plainToInstance(ReadWritingDto, writing, {
      excludeExtraneousValues: true,
    });
    return new GenericResponse<ReadWritingDto>(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() writingData: CreateWritingDto): Promise<ReadWritingDto> {
    const created = await this.writingService.create(writingData);
    return plainToInstance(ReadWritingDto, created, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() writingData: UpdateWritingDto,
  ): Promise<ReadWritingDto> {
    const updated = await this.writingService.update(id, writingData);
    return plainToInstance(ReadWritingDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.writingService.remove(id);
  }
}
