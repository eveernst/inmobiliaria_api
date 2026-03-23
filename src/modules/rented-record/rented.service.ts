import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rented } from './entities/rented.entity';
import { CreateRentedDto } from './dtos/create-rented.dto';
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
    return this.rentedRepository.find();
  }

  findOne(id: number): Promise<Rented> {
    return this.rentedRepository.findOne({ where: { id } });
  }

  async update(id: number, rentedData: Partial<Rented>): Promise<Rented> {
    await this.rentedRepository.update(id, rentedData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.rentedRepository.delete(id);
  }

  async create(createRentedDto: CreateRentedDto): Promise<Rented> {
    const property = await this.propertyRepository.findOne({
        where: { id: createRentedDto.propertyId },
    });
    if (!property) {
      throw new Error('Property not found');
    }
    const rented = this.rentedRepository.create({
        ...createRentedDto,
        property,
    });
    await this.rentedRepository.save(rented);
    return rented;
  }
}