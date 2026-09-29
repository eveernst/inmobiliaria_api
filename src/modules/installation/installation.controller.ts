import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { InstallationService } from './installation.service';
import { Installation } from './entities/installation.entity';
import { CreateInstallationDto } from './dtos/create-installation.dto';
import { ReadInstallationDto } from './dtos/read-installation.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

type AuthenticatedRequest = Request & { user: { id: number } };

@Controller('installation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstallationController {
  constructor(private readonly installationService: InstallationService) {}

  @Get()
  findAll(): Promise<ReadInstallationDto[]> {
    return this.installationService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponse<ReadInstallationDto>> {
    const installation = await this.installationService.findOne(id);
    const response = plainToClass(ReadInstallationDto, installation);
    return new GenericResponse<ReadInstallationDto>(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() installationData: CreateInstallationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<GenericResponse<ReadInstallationDto>> {
    const installation = await this.installationService.create(
      installationData,
      request.user.id,
    );
    const response = plainToClass(ReadInstallationDto, installation);
    return new GenericResponse<ReadInstallationDto>(response);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: number,
    @Body() installationData: Partial<Installation>,
  ): Promise<Installation> {
    return this.installationService.update(id, installationData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.installationService.remove(id);
  }
}
