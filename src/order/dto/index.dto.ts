import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductOrderDto {
  @ApiProperty({
    description: 'the unique identifier of the product',
    example: '6001234567890',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'the quantity of the product',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'the price of the product',
    example: 199.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'the products array',
    example: [
      { productId: '6001234567890', quantity: 2, price: 199.99 },
      { productId: '6001234567901', quantity: 1, price: 249.99 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @ApiProperty({
    description: 'the shipping address id of the order',
    example: '6001234567901',
  })
  @IsNotEmpty()
  @IsString()
  shippingAddressId: string;
}

export interface ICreateOrder {
  body: CreateOrderDto;
  user: string;
}

export class updateStatus {
  @ApiProperty({
    description: 'the status of the order',
    example: 'pending',
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
