import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+2348012345678',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Alternative phone number',
    example: '+2348098765432',
  })
  @IsNotEmpty()
  @IsString()
  alternatePhoneNumber: string;

  @ApiProperty({ description: 'Street name', example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  streetName: string;

  @ApiProperty({ description: 'Nearest landmark', example: 'Near City Mall' })
  @IsNotEmpty()
  @IsString()
  nearestLandMark: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Apartment on the 3rd floor',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'City of residence', example: 'Lagos' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'State of residence', example: 'Lagos State' })
  @IsNotEmpty()
  @IsString()
  state: string;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
