import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(12)
  password?: string;

  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
