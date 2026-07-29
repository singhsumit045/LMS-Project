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

  // =========================
  // CREATE USER
  // =========================

  async create(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  // =========================
  // GET ALL USERS
  // =========================

  async findAll() {
    return await this.userRepository.find();
  }

  // =========================
  // GET USER BY ID
  // =========================

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  // =========================
  // GET USER BY EMAIL
  // =========================

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // =========================
  // UPDATE USER PROFILE
  // =========================

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    await this.userRepository.update(
      id,
      updateUserDto,
    );

    return await this.findOne(id);
  }

  // =========================
  // UPDATE PASSWORD
  // =========================

  async updatePassword(
    id: number,
    hashedPassword: string,
  ) {
    await this.userRepository.update(id, {
      password: hashedPassword,
    });

    return await this.findOne(id);
  }

  // =========================
  // DELETE USER
  // =========================

  async remove(id: number) {
    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }

  // =========================
  // SAVE HASHED REFRESH TOKEN
  // =========================

  async updateRefreshToken(
    id: number,
    refreshToken: string,
  ) {
    await this.userRepository.update(id, {
      refreshToken,
    });
  }

  // =========================
  // REMOVE REFRESH TOKEN
  // =========================

  async removeRefreshToken(id: number) {
    await this.userRepository.update(id, {
      refreshToken: null,
    });
  }
}