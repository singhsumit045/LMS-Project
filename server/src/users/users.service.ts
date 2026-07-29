import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create new user
  async create(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  // Get all users
  async findAll() {
    return await this.userRepository.find();
  }

  // Get user by ID
  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  // Get user by email
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // Update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);

    return await this.findOne(id);
  }

  // Delete user
  async remove(id: number) {
    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }

  // Save hashed refresh token
  async updateRefreshToken(id: number, refreshToken: string) {
    await this.userRepository.update(id, {
      refreshToken,
    });
  }

  // Remove refresh token during logout
  async removeRefreshToken(id: number) {
    await this.userRepository.update(id, {
      refreshToken: null,
    });
  }
}