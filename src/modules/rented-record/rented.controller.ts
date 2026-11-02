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
import { RentedService } from './rented.service';
import { CreateRentedDto } from './dtos/create-rented.dto';
import { UpdateRentedDto } from './dtos/update-rented.dto';
import { ReadRentedDto } from './dtos/read-rented.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('rented')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentedController {
  constructor(private readonly rentedService: RentedService) {}

  @Get()
  async findAll(): Promise<ReadRentedDto[]> {
    const items = await this.rentedService.findAll();
    return plainToInstance(ReadRentedDto, items, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponse<ReadRentedDto>> {
    const rented = await this.rentedService.findOne(id);
    const response = plainToInstance(ReadRentedDto, rented, {
      excludeExtraneousValues: true,
    });
    return new GenericResponse<ReadRentedDto>(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() rentedData: CreateRentedDto): Promise<ReadRentedDto> {
    const created = await this.rentedService.create(rentedData);
    return plainToInstance(ReadRentedDto, created, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() rentedData: UpdateRentedDto,
  ): Promise<ReadRentedDto> {
    const updated = await this.rentedService.update(id, rentedData);
    return plainToInstance(ReadRentedDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rentedService.remove(id);
  }
}
