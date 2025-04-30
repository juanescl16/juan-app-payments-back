import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from './domain/entities/transaction.entity';
import { TransactionRepositoryImpl } from './infrastructure/database/transaction.repository.impl';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { TRANSACTION_REPOSITORY } from './constants/transaction-repository.token';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { UpdateTransactionStatusUseCase } from './application/use-cases/update-transaction-status.use-case';
import { WompiModule } from 'src/wompi/wompi.module';
import { PayTransactionUseCase } from './application/use-cases/pay-transaction.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    WompiModule,
  ],
  controllers: [TransactionsController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepositoryImpl,
    },
    CreateTransactionUseCase,
    UpdateTransactionStatusUseCase,
    PayTransactionUseCase,
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionsModule {}
