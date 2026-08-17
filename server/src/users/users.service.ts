import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =====================================================
  // CREATE USER
  // =====================================================

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

  // =====================================================
  // SAVE USER
  // =====================================================

  async save(user: DeepPartial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }

  // =====================================================
  // GET ALL USERS
  // =====================================================

  async findAll() {
    return await this.userRepository.find();
  }

  // =====================================================
  // GET USER BY ID
  // =====================================================

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  // =====================================================
  // GET USER BY EMAIL
  // =====================================================

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // =====================================================
  // UPDATE USER PROFILE
  // =====================================================

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

  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  async updatePassword(
    id: number,
    hashedPassword: string,
  ) {
    await this.userRepository.update(id, {
      password: hashedPassword,
    });

    return await this.findOne(id);
  }

  // =====================================================
  // DELETE USER
  // =====================================================

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    // -----------------------------------------------------
    // DELETE PROFILE IMAGE FROM CLOUDINARY
    // -----------------------------------------------------

    if (user.profileImagePublicId) {
      try {
        await this.cloudinaryService.deleteFile(
          user.profileImagePublicId,
          'image',
        );
      } catch (error) {
        console.error(
          'Failed to delete profile image from Cloudinary:',
          error,
        );
      }
    }

    // -----------------------------------------------------
    // DELETE USER FROM DATABASE
    // -----------------------------------------------------

    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }

  // =====================================================
  // SAVE HASHED REFRESH TOKEN
  // =====================================================

  async updateRefreshToken(
    id: number,
    refreshToken: string,
  ) {
    await this.userRepository.update(id, {
      refreshToken,
    });
  }

  // =====================================================
  // REMOVE REFRESH TOKEN
  // =====================================================

  async removeRefreshToken(id: number) {
    await this.userRepository.update(id, {
      refreshToken: null,
    });
  }

  // =====================================================
  // UPDATE PROFILE IMAGE
  // =====================================================

  async updateProfileImage(
    id: number,
    profileImageUrl: string,
    profileImagePublicId: string,
  ) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    // -----------------------------------------------------
    // DELETE OLD PROFILE IMAGE
    // -----------------------------------------------------

    if (user.profileImagePublicId) {
      try {
        await this.cloudinaryService.deleteFile(
          user.profileImagePublicId,
          'image',
        );
      } catch (error) {
        console.error(
          'Failed to delete old profile image:',
          error,
        );
      }
    }

    // -----------------------------------------------------
    // SAVE NEW PROFILE IMAGE
    // -----------------------------------------------------

    await this.userRepository.update(id, {
      profileImageUrl,
      profileImagePublicId,
    });

    return await this.findOne(id);
  }

  // =====================================================
  // UPDATE ONLINE STATUS
  // =====================================================

  async updateOnlineStatus(
    userId: number,
    isOnline: boolean,
  ) {
    await this.userRepository.update(userId, {
      isOnline,
      lastSeen: new Date(),
    });
  }

  // =====================================================
  // RESET ALL ONLINE STATUS
  // =====================================================

  async resetAllOnlineStatus() {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        isOnline: false,
        lastSeen: new Date(),
      })
      .execute();

    console.log(
      '🔄 All users have been marked as OFFLINE',
    );
  }

  // =====================================================
  // UPDATE TEACHER SIGNATURE
  // =====================================================

  async updateSignature(
    userId: number,
    signatureUrl: string,
    signaturePublicId: string,
  ) {
    await this.userRepository.update(
      userId,
      {
        signatureUrl,
        signaturePublicId,
      },
    );

    return await this.findOne(userId);
  }

  // =====================================================
  // FIND USER BY RESET TOKEN
  // =====================================================

  async findByResetToken(
    token: string,
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
  }

  // =====================================================
// UPDATE USER ROLE (ADMIN ONLY)
// =====================================================

async updateRole(id: number, newRole: string) {
  const user = await this.findOne(id);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // last admin ko demote hone se roko
  if (user.role === 'admin' && newRole !== 'admin') {
    const adminCount = await this.userRepository.count({
      where: { role: 'admin' },
    });

    if (adminCount <= 1) {
      throw new BadRequestException('Cannot remove the last admin');
    }
  }

  await this.userRepository.update(id, { role: newRole });

  return await this.findOne(id);
}
}