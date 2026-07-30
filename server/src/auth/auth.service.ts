
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { UpdateUserDto } from '../users/dto/update-user.dto';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // =========================
  // REGISTER
  // =========================

  async register(registerDto: RegisterDto) {
    const existingUser =
      await this.usersService.findByEmail(
        registerDto.email,
      );

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    return await this.usersService.create(
      registerDto,
    );
  }
  
  // =========================
  // LOGIN
  // =========================

  async login(loginDto: LoginDto) {
    const user =
      await this.usersService.findByEmail(
        loginDto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordMatch =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!isPasswordMatch) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // =========================
    // ACCESS TOKEN
    // =========================

    const accessToken =
      this.jwtService.sign(payload);

    // =========================
    // REFRESH TOKEN
    // =========================

    const refreshToken =
      this.jwtService.sign(payload, {
        secret:
          this.configService.get<string>(
            'JWT_REFRESH_SECRET',
          ) || 'lms-refresh-secret',

        expiresIn: '7d',
      });

    // Hash refresh token before storing
    const hashedRefreshToken =
      await bcrypt.hash(
        refreshToken,
        10,
      );

    await this.usersService.updateRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // =========================
  // UPDATE PROFILE
  // =========================

  async updateProfile(
    userId: number,
    updateUserDto: UpdateUserDto,
  ) {
    const user =
      await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    const updatedUser =
      await this.usersService.update(
        userId,
        {
          name: updateUserDto.name,
        },
      );

    if (!updatedUser) {
      throw new UnauthorizedException(
        'Unable to update profile',
      );
    }

    return {
      message:
        'Profile updated successfully',

      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  }

  // =========================
  // CHANGE PASSWORD
  // =========================

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user =
      await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    // =========================
    // VERIFY CURRENT PASSWORD
    // =========================

    const isCurrentPasswordValid =
      await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(
        'Current password is incorrect',
      );
    }

    // =========================
    // CHECK SAME PASSWORD
    // =========================

    const isSamePassword =
      await bcrypt.compare(
        changePasswordDto.newPassword,
        user.password,
      );

    if (isSamePassword) {
      throw new UnauthorizedException(
        'New password must be different from current password',
      );
    }

    // =========================
    // HASH NEW PASSWORD
    // =========================

    const hashedNewPassword =
      await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );

    // =========================
    // UPDATE PASSWORD
    // =========================

    await this.usersService.updatePassword(
      userId,
      hashedNewPassword,
    );

    // =========================
    // INVALIDATE REFRESH TOKEN
    // =========================

    await this.usersService.removeRefreshToken(
      userId,
    );

    return {
      message:
        'Password changed successfully',
    };
  }

  // =========================
  // REFRESH TOKEN
  // =========================

  async refreshToken(
    refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token is required',
      );
    }

    try {
      // =========================
      // VERIFY REFRESH TOKEN
      // =========================

      const payload =
        this.jwtService.verify(
          refreshToken,
          {
            secret:
              this.configService.get<string>(
                'JWT_REFRESH_SECRET',
              ) ||
              'lms-refresh-secret',
          },
        );

      // =========================
      // FIND USER
      // =========================

      const user =
        await this.usersService.findOne(
          payload.sub,
        );

      if (
        !user ||
        !user.refreshToken
      ) {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      // =========================
      // COMPARE REFRESH TOKEN
      // =========================

      const isRefreshTokenValid =
        await bcrypt.compare(
          refreshToken,
          user.refreshToken,
        );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      // =========================
      // NEW PAYLOAD
      // =========================

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      // =========================
      // NEW ACCESS TOKEN
      // =========================

      const newAccessToken =
        this.jwtService.sign(
          newPayload,
        );

      // =========================
      // NEW REFRESH TOKEN
      // =========================

      const newRefreshToken =
        this.jwtService.sign(
          newPayload,
          {
            secret:
              this.configService.get<string>(
                'JWT_REFRESH_SECRET',
              ) ||
              'lms-refresh-secret',

            expiresIn: '7d',
          },
        );

      // =========================
      // HASH NEW REFRESH TOKEN
      // =========================

      const hashedNewRefreshToken =
        await bcrypt.hash(
          newRefreshToken,
          10,
        );

      // =========================
      // REPLACE OLD TOKEN
      // =========================

      await this.usersService.updateRefreshToken(
        user.id,
        hashedNewRefreshToken,
      );

      return {
        access_token:
          newAccessToken,

        refresh_token:
          newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
      );
    }
  }

  // =========================
// GET PROFILE
// =========================

async getProfile(userId: number) {
  const user = await this.usersService.findOne(userId);

  if (!user) {
    throw new UnauthorizedException(
      'User not found',
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  };
}

  // =========================
  // LOGOUT
  // =========================

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(
      userId,
    );

    return {
      message: 'Logout successful',
    };
  }
}

