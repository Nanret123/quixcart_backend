import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginInterface } from './dto/index.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}
  //register new user
  async registerUser({
    firstname,
    lastname,
    username,
    email,
    password,
  }: CreateUserDto) {
    //check if user already exists
    const isUser = await this.user.findOne({ username });
    if (isUser) {
      throw new ConflictException('User already exists');
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create new user
    const newUser = new this.user({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });
    //generate verification token and save it
    const { token, hashedToken, tokenExpires } = await this.generateToken();
    newUser.verifyToken = hashedToken;
    newUser.verifyTokenExpires = tokenExpires;
    await newUser.save();
    // **Only send email if it matches your testing email**
    const myTestEmail = 'nanretgungshik@gmail.com';
    if (email === myTestEmail) {
      try {
        const verificationLink = `${this.configService.get<string>('CLIENT_URL')}/auth/verify-email?token=${token}`;
        await this.mailService.sendWelcomeEmail(
          email,
          firstname,
          verificationLink,
        );
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    }
    // Omit password before returning
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return {
      message:
        'User registered. Please check your email to verify your account.',
      user: userWithoutPassword,
    };
  }

  async verifyEmail({ token, email }: { token: string; email: string }) {
    const user = await this.user.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (
      !user.verifyToken ||
      new Date(user.verifyTokenExpires).getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid token');
    }
    //compare the token
    const isEqual = await this.compareToken(token, user.verifyToken);
    if (!isEqual) {
      throw new UnauthorizedException('Invalid token');
    }
    //update user and remove verification token
    user.isVerified = true;
    user.verifyToken = '';
    user.verifyTokenExpires = new Date(0);
    await user.save();

    return { message: 'Email verified successfully' };
  }

  //login user
  async loginUser({ email, password, res }: LoginInterface) {
    //find user and select password only
    const isUser = await this.user.findOne({ email });

    if (!isUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //compare hashed password
    const isMatch = await bcrypt.compare(password, isUser.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //generate JWT token
    const payload = { email: isUser.email, userId: isUser._id, res };
    const accessToken = this.signToken({ ...payload });

    const { password: _, ...userWithoutPassword } = isUser.toObject();

    return res.status(200).json({
      message: 'User logged in successfully',
      user: userWithoutPassword,
    });
  }

  //forgot password
  async forgotPassword({ email }: { email: string }) {
    //find user in the db
    const isUser = await this.user.findOne({ email });

    if (!isUser) {
      throw new NotFoundException('User not found');
    }
    const { token, hashedToken, tokenExpires } = await this.generateToken();
    console.log(token);

    //update user with reset token and expiration date
    isUser.resetPasswordToken = token;
    isUser.resetPasswordTokenExpires = tokenExpires;

    //save the fields
    await isUser.save();

    // **Only send email if it matches your testing email**
    try {
      // Send email with reset link
      const resetPasswordLink = `${this.configService.get<string>('CLIENT_URL')}/reset-password?token=${token}`;
      await this.mailService.sendResetPasswordLink(
        email,
        isUser.firstname,
        resetPasswordLink,
      );
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    return {
      message: 'Reset password link sent successfully',
    };
  }

  //reset password
  async resetPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) {
    const user = await this.user.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new ForbiddenException(
        'Invalid or expired reset token. Please try again',
      );
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update user and remove  token
    user.password = hashedPassword;
    user.resetPasswordToken = '';
    user.resetPasswordTokenExpires = new Date(0);
    await user.save();

    return { message: 'Password successfully reset' };
  }

  //logout user
  logoutUser(res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({
      message: 'User logged out successfully',
    });
  }

  //sign token and create cookie
  private signToken({
    email,
    userId,
    res,
  }: {
    email: string;
    userId: Types.ObjectId;
    res: Response;
  }) {
    const accessToken = this.jwtService.sign({ email, userId });

    // Set JWT in HTTP-only cookie
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return accessToken;
  }

  private async generateToken() {
    const token = crypto.randomBytes(20).toString('hex');
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const hashedToken = await bcrypt.hash(token, 10);

    return { token, hashedToken, tokenExpires };
  }

  private async compareToken(token: string, hashedToken: string) {
    return await bcrypt.compare(token, hashedToken);
  }
}
