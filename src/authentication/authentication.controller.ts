import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginInterface,
  LoginUserDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/index.dto';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/decorators/index.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('/auth')
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ description: 'Details of the new user', type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: CreateUserDto) {
    return this.service.registerUser(body);
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ description: 'User credentials', type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const payload: LoginInterface = { ...body, res };
    return this.service.loginUser(payload);
  }

  @Public()
  @Post('/verify-email')
  @ApiOperation({ summary: 'Verify Email' })
  @ApiBody({ description: 'User credentials', type: VerifyEmailDto })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @HttpCode(HttpStatus.OK)
  async verify(@Body() body: VerifyEmailDto) {
    return this.service.verifyEmail(body);
  }

  @Throttle({ default: { limit: 3, ttl: 86400 } }) // Allow max 3 requests per 24 hours
  @Public()
  @Post('/forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiBody({ description: 'User email', type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Reset password link sent successfully',
  })
  @HttpCode(HttpStatus.OK)
  async forgotPasswordController(@Body() body: ForgotPasswordDto) {
    return this.service.forgotPassword(body);
  }

  @Public()
  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBody({
    description: 'User credentials',
    type: ResetPasswordDto,
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @HttpCode(HttpStatus.OK)
  async resetPasswordController(@Body() body: ResetPasswordDto) {
    return this.service.resetPassword(body);
  }

  @Public()
  @Post('/logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
    return this.service.logoutUser(res);
  }
}
