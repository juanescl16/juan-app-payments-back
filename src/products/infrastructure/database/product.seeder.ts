import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.productRepository.count();
    if (count > 0) {
      this.logger.log('Productos ya existentes, seeder no ejecutado.');
      return;
    }

    const products = [
      {
        name: 'Camiseta Negra',
        description: 'Camiseta de algodón 100%',
        price: 50000,
        stock: 10,
      },
      {
        name: 'Pantalón Deportivo',
        description: 'Pantalón ideal para correr o entrenar',
        price: 80000,
        stock: 15,
      },
      {
        name: 'Zapatillas Running',
        description: 'Zapatillas ligeras para entrenamiento',
        price: 150000,
        stock: 5,
      },
    ];

    await this.productRepository.save(products);
    this.logger.log('Productos dummy insertados correctamente.');
  }
}
