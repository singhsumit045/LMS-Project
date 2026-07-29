
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return await this.usersService.create(registerDto);
  }

  // =========================
  // LOGIN
  // =========================

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordMatch = await bcrypt.compare(
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

    // Access Token
    const accessToken = this.jwtService.sign(payload);

    // Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'lms-refresh-secret',

      expiresIn: '7d',
    });

    // Hash refresh token before storing
    const hashedRefreshToken = await bcrypt.hash(
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
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    // Only name is allowed to be updated
    const updatedUser = await this.usersService.update(
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
      message: 'Profile updated successfully',

      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  }

  // =========================
  // REFRESH TOKEN
  // =========================

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token is required',
      );
    }

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'lms-refresh-secret',
      });

      // Find user
      const user = await this.usersService.findOne(
        payload.sub,
      );

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      // Compare provided token with hashed token in DB
      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      // New payload
      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      // Generate new access token
      const newAccessToken =
        this.jwtService.sign(newPayload);

      // Generate new refresh token
      const newRefreshToken =
        this.jwtService.sign(newPayload, {
          secret:
            this.configService.get<string>(
              'JWT_REFRESH_SECRET',
            ) || 'lms-refresh-secret',

          expiresIn: '7d',
        });

      // Hash new refresh token
      const hashedNewRefreshToken =
        await bcrypt.hash(newRefreshToken, 10);

      // Replace old refresh token
      await this.usersService.updateRefreshToken(
        user.id,
        hashedNewRefreshToken,
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
      );
    }
  }

  // =========================
  // LOGOUT
  // =========================

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);

    return {
      message: 'Logout successful',
    };
  }
}

