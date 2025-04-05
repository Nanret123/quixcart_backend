import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IUpdateUser, UpdateUserDto } from './dto/index.dto';
import { PaginationDto } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all  users' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() query: PaginationDto) {
    return this.service.getAllUsers(query);
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get one user by Id' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getOneUser(@Param('userId') userId: string) {
    return this.service.getUserById({ userId });
  }

  @Patch('/:userId/role')
  @ApiOperation({ summary: 'Update user role by Id' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @HttpCode(HttpStatus.OK)
  async updateUserRole(@Param('userId') userId: string, @Body() role: string) {
    return this.service.updateUserRole({ userId, role });
  }

  @Patch('/:userId')
  @ApiOperation({ summary: 'Update user by Id' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @HttpCode(HttpStatus.OK)
  async updateOneUser(
    @Body() body: UpdateUserDto,
    @Param('userId') userId: string,
  ) {
    const payload: IUpdateUser = { userId, body };
    return this.service.updateUser(payload);
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete user by Id' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('userId') userId: string) {
    return this.service.deleteUser({ userId });
  }

  @Patch('/:userId/role')
  @ApiOperation({ summary: 'Update user role by Id' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @HttpCode(HttpStatus.OK)
  async updateRole(@Param('userId') userId: string, @Body() role: string) {
    return this.service.updateUserRole({ userId, role });
  }
}
