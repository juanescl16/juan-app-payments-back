import { Injectable, Inject } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../constants/transaction-repository.token';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { WompiService } from 'src/wompi/wompi.service';
import { Result } from 'src/common/core/result';
import { ProductRepository } from 'src/products/domain/repositories/product.repository';
import { PRODUCT_REPOSITORY } from 'src/products/constants/product-repository.token';

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
    @Inject(PRODUCT_REPOSITORY)
  private readonly productRepository: ProductRepository,
    private readonly wompiService: WompiService,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
  ) {}

  async execute(input: PayTransactionInput): Promise<Result<void>> {
    const transaction = await this.transactionRepository.findById(input.transactionId);

    if (!transaction) {
      return Result.fail('Transacción no encontrada');
    }

    try {
      // 1. Ejecutar pago
      const wompiResponse = await this.wompiService.makeCardPayment({
        amountInCents: Number(transaction.amount) * 100,
        currency: 'COP',
        customerEmail: input.customerEmail,
        reference: transaction.reference,
        cardToken: input.cardToken,
      });

      const wompiTransactionId = wompiResponse.data.id;

      // 2. Hacer polling hasta que se resuelva
      let status = wompiResponse.data.status;
      let attempts = 0;

      while (status === 'PENDING' && attempts < 5) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // espera 2 segundos
        status = await this.wompiService.getTransactionStatus(wompiTransactionId);
        attempts++;
      }

      // 3. Actualizar transacción en base de datos
      const finalStatus =
        status === 'APPROVED' ? TransactionStatus.APPROVED : TransactionStatus.DECLINED;

      await this.updateTransactionStatusUseCase.execute({
        transactionId: transaction.id,
        status: finalStatus,
        wompiTransactionId,
      });

      if (finalStatus === TransactionStatus.APPROVED) {
        await this.productRepository.decreaseStock(transaction.productId);
      }

      // 4. Respuesta
      if (finalStatus === TransactionStatus.APPROVED) {
        return Result.ok();
      } else {
        return Result.fail('Pago rechazado en Wompi');
      }
    } catch (error) {
      return Result.fail('Error procesando pago en Wompi');
    }
  }
}
