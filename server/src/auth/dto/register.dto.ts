import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail({}, {
    message: 'Please enter a valid email address',
  })
  email!: string;

  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  password!: string;

  @IsOptional()
  @IsString()
  role?: string;
}