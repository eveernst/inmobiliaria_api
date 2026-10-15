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
import { UpdateClassificationDto } from './dtos/update-classification.dto';
import { ReadClassificationDto } from './dtos/read-classification.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('classification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  async findAll(): Promise<ReadClassificationDto[]> {
    const classifications = await this.classificationService.findAll();
    return plainToInstance(ReadClassificationDto, classifications, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponse<ReadClassificationDto>> {
    const classification = await this.classificationService.findOne(id);
    const response = plainToInstance(ReadClassificationDto, classification, {
      excludeExtraneousValues: true,
    });
    return new GenericResponse<ReadClassificationDto>(response);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() classificationData: UpdateClassificationDto,
  ): Promise<ReadClassificationDto> {
    const classification = await this.classificationService.update(
      id,
      classificationData,
    );
    return plainToInstance(ReadClassificationDto, classification, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.classificationService.remove(id);
  }
}
