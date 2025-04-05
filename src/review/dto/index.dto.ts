import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'the review comment',
    example: 'Love this shoes!',
  })
  @IsNotEmpty()
  @IsString()
  review: string;

  @ApiProperty({
    description: 'the review rating',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty({
    description: 'the product id',
    example: '60916d2054179b29749497d4',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
}

export interface ICreateReview {
  productId: string;
  body: CreateReviewDto;
  user: string;
}
