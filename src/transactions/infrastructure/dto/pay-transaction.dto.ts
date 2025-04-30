import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayTransactionDto {
  @ApiProperty({ example: 'cliente@email.com', description: 'Correo electrónico del cliente' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: 'token_fake_card', description: 'Token de tarjeta generado en Wompi' })
  @IsString()
  @IsNotEmpty()
  cardToken: string;
}
