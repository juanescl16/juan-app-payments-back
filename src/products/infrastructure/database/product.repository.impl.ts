import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly ormRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.ormRepository.find();
  }
}
