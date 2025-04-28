import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import { Result } from 'src/common/core/result';
import { TRANSACTION_REPOSITORY } from 'src/transactions/constants/transaction-repository.token';

interface CreateTransactionInput {
  amount: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Result<Transaction>> {
    if (input.amount <= 0) {
      return Result.fail('El monto debe ser mayor que cero.');
    }

    const transaction = await this.transactionRepository.create({
      amount: input.amount,
      customerName: input.customerName,
      customerAddress: input.customerAddress,
      customerPhone: input.customerPhone,
      status: TransactionStatus.PENDING,
    });

    return Result.ok(transaction);
  }
}
