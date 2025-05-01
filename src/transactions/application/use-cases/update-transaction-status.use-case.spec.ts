import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case'
import { TransactionStatus } from '../../domain/entities/transaction.entity'
import { TransactionRepository } from '../../domain/repositories/transaction.repository'

const mockProduct = {
  id: 1,
  name: 'Producto 1',
  description: 'Desc',
  price: 10000,
  stock: 5,
}

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
  product: mockProduct,
}

describe('UpdateTransactionStatusUseCase', () => {
  let useCase: UpdateTransactionStatusUseCase
  let transactionRepository: jest.Mocked<TransactionRepository>

  beforeEach(() => {
    transactionRepository = {
      findById: jest.fn(),
      updateStatus: jest.fn(), 
    } as unknown as jest.Mocked<TransactionRepository>

    useCase = new UpdateTransactionStatusUseCase(transactionRepository)
  })

  it('debería actualizar el estado de la transacción exitosamente', async () => {

    transactionRepository.findById.mockResolvedValue(mockTransaction as any)

    const result = await useCase.execute({
      transactionId: 1,
      status: TransactionStatus.APPROVED,
      wompiTransactionId: '123',
    })

    expect(result.isSuccess).toBe(true)

    expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
      1,
      TransactionStatus.APPROVED,
      '123'
    )
  })

  it('debería fallar si la transacción no existe', async () => {
    transactionRepository.findById.mockResolvedValue(null)

    const result = await useCase.execute({
      transactionId: 999,
      status: TransactionStatus.DECLINED,
      wompiTransactionId: 'xyz',
    })

    expect(result.isFailure).toBe(true)
    expect(result.error).toBe('Transacción no encontrada')
  })
})
