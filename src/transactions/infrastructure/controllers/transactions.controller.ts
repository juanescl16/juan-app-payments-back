import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { PayTransactionDto } from '../dto/pay-transaction.dto';
import { PayTransactionUseCase } from 'src/transactions/application/use-cases/pay-transaction.use-case';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly payTransactionUseCase: PayTransactionUseCase,
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

  @Post(':id/pay')
  @ApiOperation({ summary: 'Pagar una transacción existente con tarjeta' })
  @ApiResponse({ status: 200, description: 'Resultado del intento de pago.' })
  async pay(
    @Param('id') id: string,
    @Body() payTransactionDto: PayTransactionDto,
  ) {
    const result = await this.payTransactionUseCase.execute({
      transactionId: Number(id),
      customerEmail: payTransactionDto.customerEmail,
      cardToken: payTransactionDto.cardToken,
    });

    if (result.isFailure) {
      return {
        message: result.error,
      };
    }

    return {
      message: 'Pago procesado exitosamente.',
    };
  }

}
