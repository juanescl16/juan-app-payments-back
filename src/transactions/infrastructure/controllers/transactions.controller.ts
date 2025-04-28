import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiResponse({ status: 201, description: 'Transacción creada exitosamente.' })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const result = await this.createTransactionUseCase.execute(createTransactionDto);

    if (result.isFailure) {
      return {
        message: result.error,
      };
    }

    return {
      message: 'Transacción creada exitosamente.',
      transaction: result.getValue(),
    };
  }
}
