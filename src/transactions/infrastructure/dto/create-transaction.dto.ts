import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 50000, description: 'Monto total de la transacción' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del cliente' })
  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @ApiProperty({ example: '3001234567', description: 'Teléfono del cliente' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;
}
