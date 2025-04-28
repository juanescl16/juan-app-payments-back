import { Injectable, Inject } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../constants/transaction-repository.token';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { Result } from 'src/common/core/result';

interface UpdateTransactionStatusInput {
  transactionId: number;
  status: TransactionStatus;
  wompiTransactionId?: string;
}

@Injectable()
export class UpdateTransactionStatusUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(input: UpdateTransactionStatusInput): Promise<Result<void>> {
    const transaction = await this.transactionRepository.findById(input.transactionId);

    if (!transaction) {
      return Result.fail('Transacción no encontrada');
    }

    await this.transactionRepository.updateStatus(
      input.transactionId,
      input.status,
      input.wompiTransactionId,
    );

    return Result.ok();
  }
}
