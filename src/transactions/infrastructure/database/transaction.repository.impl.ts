import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatus } from '../../domain/entities/transaction.entity';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly ormRepository: Repository<Transaction>,
  ) {}

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.ormRepository.create(transaction);
    return await this.ormRepository.save(newTransaction);
  }

  async updateStatus(id: number, status: TransactionStatus, wompiTransactionId?: string): Promise<Transaction> {
    const transaction = await this.ormRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = status;
    if (wompiTransactionId) {
      transaction.wompiTransactionId = wompiTransactionId;
    }

    return await this.ormRepository.save(transaction);
  }

  async findById(id: number): Promise<Transaction | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }
}
