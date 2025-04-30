import { Injectable, Inject } from '@nestjs/common';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from 'src/transactions/domain/repositories/transaction.repository';
import { Result } from 'src/common/core/result';
import { TRANSACTION_REPOSITORY } from '../../constants/transaction-repository.token';


interface CreateTransactionInput {
  amount: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  productId: number;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  private generateReference(): string {
    return `ref_${Date.now()}`;
  }

  async execute(input: CreateTransactionInput): Promise<Result<Transaction>> {
    try {
      const reference = this.generateReference();

      const transaction = await this.transactionRepository.create({
        amount: input.amount,
        customerName: input.customerName,
        customerAddress: input.customerAddress,
        customerPhone: input.customerPhone,
        reference,
        status: TransactionStatus.PENDING,
        productId: input.productId,
      });
      console.log('Transaction creada:', transaction);

      return Result.ok(transaction);
    } catch (error) {
      return Result.fail('Error al crear la transacción');
    }
  }
}
