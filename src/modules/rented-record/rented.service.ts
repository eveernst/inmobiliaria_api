import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rented } from './entities/rented.entity';
import { CreateRentedDto } from './dtos/create-rented.dto';
import { UpdateRentedDto } from './dtos/update-rented.dto';
import { Property } from '../property/entities/property.entity';

@Injectable()
export class RentedService {
  constructor(
    @InjectRepository(Rented)
    private readonly rentedRepository: Repository<Rented>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  findAll(): Promise<Rented[]> {
    return this.rentedRepository.find({ relations: ['property'] });
  }

  async findOne(id: number): Promise<Rented> {
    const rented = await this.rentedRepository.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!rented) {
      throw new NotFoundException('Rented record not found');
    }
    return rented;
  }

  async update(id: number, rentedData: UpdateRentedDto): Promise<Rented> {
    if (Object.keys(rentedData).length > 0) {
      await this.rentedRepository.update(id, rentedData);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.rentedRepository.delete(id);
    if (!affected) {
      throw new NotFoundException('Rented record not found');
    }
  }

  async create(createRentedDto: CreateRentedDto): Promise<Rented> {
    const property = await this.propertyRepository.findOne({
      where: { id: createRentedDto.propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    const rented = this.rentedRepository.create({
      ...createRentedDto,
      property,
    });
    await this.rentedRepository.save(rented);
    return rented;
  }
}
