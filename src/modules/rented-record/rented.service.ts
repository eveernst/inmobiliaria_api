import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rented } from './entities/rented.entity';
import { CreateRentedDto } from './dtos/create-rented.dto';

@Injectable()
export class RentedService {
  constructor(
    @InjectRepository(Rented)
    private readonly rentedRepository: Repository<Rented>,
  ) {}

  findAll(): Promise<Rented[]> {
    return this.rentedRepository.find();
  }

  findOne(id: number): Promise<Rented> {
    return this.rentedRepository.findOne({ where: { id } });
  }

  async create(rentedData: CreateRentedDto): Promise<Rented> {
    const rented = this.rentedRepository.create(rentedData);
    return await this.rentedRepository.save(rented);
  }

  async update(id: number, rentedData: Partial<Rented>): Promise<Rented> {
    await this.rentedRepository.update(id, rentedData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.rentedRepository.delete(id);
  }
}