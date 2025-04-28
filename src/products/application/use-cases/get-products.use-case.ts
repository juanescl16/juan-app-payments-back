import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../constants/product-repository.token';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from 'src/products/domain/entities/product.entity';
import { Result } from 'src/common/core/result';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(): Promise<Result<Product[]>> {
    const products = await this.productRepository.findAll();

    if (!products || products.length === 0) {
      return Result.fail('No hay productos disponibles');
    }

    return Result.ok(products);
  }
}
