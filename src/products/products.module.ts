import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './domain/entities/product.entity';
import { ProductRepositoryImpl } from './infrastructure/database/product.repository.impl';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { PRODUCT_REPOSITORY } from './constants/product-repository.token';
import { ProductSeeder } from './infrastructure/database/product.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryImpl,
    },
    GetProductsUseCase,
    ProductSeeder,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
