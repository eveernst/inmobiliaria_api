import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';
import { ReadPropertyDto } from './dtos/read-property.dto';
import { ReadPropertyInstallationDto } from './dtos/read-property-installation.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('property')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  findAll(): Promise<ReadPropertyDto[]> {
    return this.propertyService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReadPropertyInstallationDto> {
    return await this.propertyService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() propertyData: CreatePropertyDto): Promise<GenericResponse<ReadPropertyDto>> {
    const property = await this.propertyService.create(propertyData);
    const response = plainToClass(ReadPropertyDto, property);
    return new GenericResponse<ReadPropertyDto>(response);
  }
  
  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() propertyData: Partial<Property>): Promise<ReadPropertyInstallationDto> {
    console.log('=== UPDATE PROPERTY ===');
    console.log('ID:', id);
    console.log('Data received:', JSON.stringify(propertyData, null, 2));
    return this.propertyService.update(id, propertyData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.propertyService.remove(id);
  }

  @Post(':id/writing')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
          const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  uploadWriting(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertyService.attachWriting(id, file.path);
  }

  @Post(':id/plan')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  uploadPlan(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertyService.attachPlan(id, file.path);
  }

  @Post(':id/insurance')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  uploadInsurance(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertyService.attachInsurance(id, file.path);
  }

}