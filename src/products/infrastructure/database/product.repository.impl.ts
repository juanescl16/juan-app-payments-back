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

  async decreaseStock(productId: number): Promise<void> {
    const product = await this.ormRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new Error('Producto no encontrado');
    }
  
    if (product.stock <= 0) {
      throw new Error('No hay stock disponible');
    }
  
    product.stock -= 1;
    await this.ormRepository.save(product);
  }
}
