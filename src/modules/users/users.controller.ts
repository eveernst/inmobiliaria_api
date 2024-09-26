import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReadUserDto } from './dtos/read-user.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GenericResponse<ReadUserDto>> {
    const user = await this.usersService.findOne(id);
    const response = plainToClass(ReadUserDto, user);
    return new GenericResponse<ReadUserDto>(response);
  }

  @Post()
  async create(@Body() userData: CreateUserDto): Promise<GenericResponse<ReadUserDto>> {
    const user = await this.usersService.create(userData);
    const response = plainToClass(ReadUserDto, user);
    return new GenericResponse<ReadUserDto>(response);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}