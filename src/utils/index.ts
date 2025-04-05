import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Page number', example: 1, minimum: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  limit: number;
}
