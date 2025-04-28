import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../entities/transaction.entity';

export abstract class TransactionRepository {
  abstract create(transaction: Partial<Transaction>): Promise<Transaction>;
  abstract updateStatus(id: number, status: TransactionStatus, wompiTransactionId?: string): Promise<Transaction>;
  abstract findById(id: number): Promise<Transaction | null>;
}
