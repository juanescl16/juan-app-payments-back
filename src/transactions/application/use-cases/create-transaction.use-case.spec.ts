import { CreateTransactionUseCase } from './create-transaction.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatus } from '../../domain/entities/transaction.entity';

const mockRepository = () => ({
  create: jest.fn(),
});

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    transactionRepository = mockRepository() as any;
    useCase = new CreateTransactionUseCase(transactionRepository);
  });

  it('debería crear una transacción exitosamente', async () => {
    const mockTransaction = {
        id: 1,
        amount: 100000,
        status: TransactionStatus.PENDING,
        reference: 'ref_123456789',
        wompiTransactionId: '',
        customerName: 'Juan Pérez',
        customerAddress: 'Calle 123',
        customerPhone: '3001234567',
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: 1,
        product: undefined as any,
    };

    transactionRepository.create.mockResolvedValue(mockTransaction);

    const result = await useCase.execute({
      amount: 50000,
      customerName: 'Juan',
      customerAddress: 'Calle Falsa',
      customerPhone: '3001234567',
      productId: 1,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual(mockTransaction);
    expect(transactionRepository.create).toHaveBeenCalled();
  });

  it('debería fallar si hay un error en el repositorio', async () => {
    transactionRepository.create.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute({
      amount: 50000,
      customerName: 'Juan',
      customerAddress: 'Calle Falsa',
      customerPhone: '3001234567',
      productId: 1,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Error al crear la transacción');
  });
});
