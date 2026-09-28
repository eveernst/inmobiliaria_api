import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { Classification } from './entities/classification.entity';
import { ReadClassificationDto } from './dtos/read-classification.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('classification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  findAll(): Promise<Classification[]> {
    return this.classificationService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponse<ReadClassificationDto>> {
    const classification = await this.classificationService.findOne(id);
    const response = plainToClass(ReadClassificationDto, classification);
    return new GenericResponse<ReadClassificationDto>(response);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: number,
    @Body() classificationData: Partial<Classification>,
  ): Promise<Classification> {
    return this.classificationService.update(id, classificationData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.classificationService.remove(id);
  }
}
