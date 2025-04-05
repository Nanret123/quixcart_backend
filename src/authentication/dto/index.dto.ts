import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Response } from 'express';

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
    description: 'the phone number of the user',
    example: '23456788543',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class LoginUserDto {
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
  password: string;
}

export interface LoginInterface {
  email: string;
  password: string;
  res: Response;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: 'the verification token',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'the user email',
    example: 'nanret@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'the user email',
    example: 'nanret@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'the verification token',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'the new password',
    example: 'NewPassword@123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
