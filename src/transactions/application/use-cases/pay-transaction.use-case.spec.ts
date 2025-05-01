import { PayTransactionUseCase } from './pay-transaction.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { ProductRepository } from 'src/products/domain/repositories/product.repository';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case';
import { WompiService } from 'src/wompi/wompi.service';

describe('PayTransactionUseCase', () => {
  let useCase: PayTransactionUseCase;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let productRepository: jest.Mocked<ProductRepository>;
  let wompiService: jest.Mocked<WompiService>;
  let updateStatusUseCase: jest.Mocked<UpdateTransactionStatusUseCase>;

  beforeEach(() => {
    transactionRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
    } as any;

    productRepository = {
      decreaseStock: jest.fn(),
    } as any;

    wompiService = {
      makeCardPayment: jest.fn(),
    } as any;

    updateStatusUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new PayTransactionUseCase(
      transactionRepository,
      productRepository,
      wompiService,
      updateStatusUseCase
    );
  });

  it('debería procesar un pago exitoso y actualizar estado + stock', async () => {
    const mockTransaction = {
      id: 1,
      amount: 100000,
      status: TransactionStatus.PENDING,
      reference: 'ref_123456789',
      customerName: 'Juan Pérez',
      customerAddress: 'Calle 123',
      customerPhone: '3001234567',
      wompiTransactionId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: 1,
      product: undefined,
    };

    transactionRepository.findById.mockResolvedValue(mockTransaction as any);

    wompiService.makeCardPayment.mockResolvedValue({
      data: {
        id: 'abc123',
        status: 'APPROVED',
      },
    });

    const result = await useCase.execute({
      transactionId: 1,
      customerEmail: 'cliente@test.com',
      cardToken: 'token123',
    });

    expect(result.isSuccess).toBe(true);
    expect(updateStatusUseCase.execute).toHaveBeenCalledWith({
      transactionId: 1,
      status: TransactionStatus.APPROVED,
      wompiTransactionId: 'abc123',
    });
    expect(productRepository.decreaseStock).toHaveBeenCalledWith(1);
  });

  it('debería fallar si la transacción no existe', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute({
      transactionId: 99,
      customerEmail: 'x@x.com',
      cardToken: 'token',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Transacción no encontrada');
  });
});
