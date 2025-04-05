import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/utils';

export class CreateProductDto {
  @ApiProperty({
    description: 'the name of the product to create',
    example: 'Nike shoes',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'the category of the product',
    example: 'Shoes',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'the description of the product',
    example: 'Nike shoes with comfortable design',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'the price of the product',
    example: 199.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'the image URL of the product',
    example: 'https://example.com/shoes.jpg',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'the color of the product',
    example: 'Black',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: 'the author of the product',
    example: 'Nike',
  })
  @IsNotEmpty()
  @IsString()
  author: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export interface IUpdateProduct {
  productId: string;
  body: UpdateProductDto;
}

export class ProductQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'Category filter',
    example: 'electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Color filter', example: 'red', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Minimum price filter',
    example: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price filter',
    example: 500,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
