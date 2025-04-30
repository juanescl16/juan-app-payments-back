import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/domain/entities/product.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  FAILED = 'FAILED',
}

@Entity('transactions')
export class Transaction {
  @ApiProperty({ example: 1, description: 'ID único de la transacción' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productId: number;

  @ApiProperty({ example: 50000, description: 'Monto total de la transacción' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ example: 'PENDING', enum: TransactionStatus })
  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @ApiProperty({ example: 'ref_1714372801234', description: 'Referencia única de la transacción' })
  @Column()
  reference: string;

  @ApiProperty({ example: 'wompi_tx_12345', description: 'ID de transacción en Wompi' })
  @Column({ nullable: true })
  wompiTransactionId: string;

  @ApiProperty({ example: 'Cliente ejemplo', description: 'Nombre del cliente' })
  @Column()
  customerName: string;

  @ApiProperty({ example: 'Direccion ejemplo', description: 'Dirección del cliente' })
  @Column()
  customerAddress: string;

  @ApiProperty({ example: '3001234567', description: 'Teléfono del cliente' })
  @Column()
  customerPhone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
