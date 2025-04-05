import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @ApiProperty({
    description: 'the first name of the user',
    example: 'Nanret',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: 'the last name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'the username of the user',
    example: 'n_john',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'the email of the user',
    example: 'nanret@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'the password of the user',
    example: 'Password@123',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'the profile image of the user',
    example: 'https://example.com/profile.jpg',
  })
  @IsNotEmpty()
  @IsString()
  profileImage: string;

  @ApiProperty({
    description: 'the role of the user',
    example: 'user',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export interface IUpdateUser {
  userId: string;
  body: UpdateUserDto;
}
