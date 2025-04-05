import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, IUpdateUser } from './dto/index.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  //create a new user
  async createUser({
    firstname,
    lastname,
    username,
    email,
    password,
    role,
    profileImage,
  }: CreateUserDto) {
    //check if the user exists
    const existingUser = await this.user.findOne({ username, email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const newUser = new this.user({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role,
      profileImage,
    });
    await newUser.save();

    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  async getAllUsers({ page = 1, limit = 10 }: { page: number; limit: number }) {
    // Ensure page and limit are positive numbers
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await this.user
      .find({}, '-password') // Exclude password field
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total user count
    const totalUsers = await this.user.countDocuments();

    return {
      message: 'Users fetched successfully',
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  }

  //get user by id
  async getUserById({ userId }: { userId: string }) {
    const user = await this.user.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User fetched successfully',
      user,
    };
  }

  //update user by id
  async updateUser(payload: IUpdateUser) {
    const { userId, body } = payload;
    const user = await this.user
      .findByIdAndUpdate(userId, body, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User updated successfully',
      user,
    };
  }

  //delete user by id
  async deleteUser({ userId }: { userId: string }) {
    const user = await this.user.findByIdAndDelete(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User deleted successfully',
    };
  }

  //update user role
  async updateUserRole({ userId, role }: { userId: string; role: string }) {
    const user = await this.user
      .findByIdAndUpdate(userId, { role }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User role updated successfully',
      user,
    };
  }
}
