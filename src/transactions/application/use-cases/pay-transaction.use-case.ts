import { Injectable, Inject } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../constants/transaction-repository.token';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { WompiService } from 'src/wompi/wompi.service';
import { Result } from 'src/common/core/result';

interface PayTransactionInput {
  transactionId: number;
  customerEmail: string;
  cardToken: string; 
}

@Injectable()
export class PayTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly wompiService: WompiService,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
  ) {}

  async execute(input: PayTransactionInput): Promise<Result<void>> {
    const transaction = await this.transactionRepository.findById(input.transactionId);

    if (!transaction) {
      return Result.fail('Transacción no encontrada');
    }

    try {
      const wompiResponse = await this.wompiService.makeCardPayment({
        amountInCents: Number(transaction.amount) * 100, // conversion a centavos
        currency: 'COP',
        customerEmail: input.customerEmail,
        reference: transaction.reference,
        cardToken: input.cardToken,
      });

      if (wompiResponse.data.status === 'APPROVED') {
        await this.updateTransactionStatusUseCase.execute({
          transactionId: transaction.id,
          status: TransactionStatus.APPROVED,
          wompiTransactionId: wompiResponse.data.id,
        });

        return Result.ok();
      } else {
        await this.updateTransactionStatusUseCase.execute({
          transactionId: transaction.id,
          status: TransactionStatus.DECLINED,
          wompiTransactionId: wompiResponse.data.id,
        });

        return Result.fail('Pago rechazado en Wompi');
      }
    } catch (error) {
      return Result.fail('Error procesando pago en Wompi');
    }
  }
}
