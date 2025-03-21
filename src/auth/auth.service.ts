import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result: UserDto = { ...user };

      delete result.password;

      return result;
    }

    return null;
  }

  login(user: UserDto): Promise<{ access_token: string; user: UserDto }> {
    const payload = {
      email: user.email,
      sub: user._id,
    };

    const access_token: string = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async register(UserDto: any) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(UserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(UserDto.password, 10);

    // Create new user
    const newUser = await this.usersService.create({
      ...UserDto,
      password: hashedPassword,
    });

    // Return user without password
    const { password, ...result } = newUser;
    return result;
  }
}
