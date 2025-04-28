import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>;
}
