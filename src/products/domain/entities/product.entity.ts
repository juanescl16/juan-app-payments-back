import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({ example: 1, description: 'ID único del producto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Camiseta negra', description: 'Nombre del producto' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Camiseta de algodón 100%', description: 'Descripción del producto' })
  @Column()
  description: string;

  @ApiProperty({ example: 50000, description: 'Precio en pesos colombianos' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: 10, description: 'Unidades disponibles en inventario' })
  @Column()
  stock: number;
}
