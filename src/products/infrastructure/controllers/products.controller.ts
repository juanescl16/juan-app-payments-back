import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { Product } from '../../domain/entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de productos disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de productos retornada correctamente.', type: [Product] })
  async findAll() {
    const result = await this.getProductsUseCase.execute();

    if (result.isFailure) {
      return {
        message: result.error,
        products: [],
      };
    }

    return {
      message: 'Productos encontrados',
      products: result.getValue(),
    };
  }
}
