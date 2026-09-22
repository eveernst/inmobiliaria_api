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
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ReadUserDto } from './dtos/read-user.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private toReadDto(user: User): GenericResponse<ReadUserDto> {
    const response = plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
    return new GenericResponse<ReadUserDto>(response);
  }

  @Get()
  async findAll(): Promise<ReadUserDto[]> {
    const users = await this.usersService.findAll();
    return plainToInstance(ReadUserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponse<ReadUserDto>> {
    const user = await this.usersService.findOne(id);
    return this.toReadDto(user);
  }

  @Post()
  @Roles(UserRole.SUPERUSER)
  async create(
    @Body() userData: CreateUserDto,
  ): Promise<GenericResponse<ReadUserDto>> {
    const user = await this.usersService.create(userData);
    return this.toReadDto(user);
  }

  @Put(':id')
  @Roles(UserRole.SUPERUSER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<GenericResponse<ReadUserDto>> {
    const user = await this.usersService.update(id, userData);
    return this.toReadDto(user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERUSER)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
