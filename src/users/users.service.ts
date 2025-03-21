import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: UserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: userDto.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      const password = userDto.password || '';

      const hashedPassword = bcrypt.hash(password, 10);

      const user = new this.userModel({
        ...userDto,
        password: hashedPassword,
      });

      return user.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ConflictException(error.message);
      }
      throw new ConflictException('Error creating user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, userDto: UserDto): Promise<User> {
    if (userDto.email) {
      const existingUser = await this.userModel
        .findOne({ email: userDto.email, _id: { $ne: id } })
        .exec();

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}
