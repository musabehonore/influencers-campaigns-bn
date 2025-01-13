import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      await newUser.save();
      return {
        success: true,
        data: newUser,
        message: 'User registered successfully!',
      };
    } catch (error) {
      console.error('Error signing up:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  async login(credentials: { email: string; password: string }): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    try {
      const user = await this.userModel
        .findOne({ email: credentials.email })
        .exec();
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials.',
        };
      }
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials.',
        };
      }
      const token = this.jwtService.sign({
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      });
      return {
        success: true,
        data: {
          token,
          role: user.role,
        },
        message: 'Login successful!',
      };
    } catch (error) {
      console.error('Error logging in:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }
}
