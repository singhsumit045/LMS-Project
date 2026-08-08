
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { UpdateUserDto } from '../users/dto/update-user.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // =====================================================
  // REGISTER
  // =====================================================

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ) {
    return await this.authService.register(
      registerDto,
    );
  }

  // =====================================================
  // LOGIN
  // =====================================================

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {
    return await this.authService.login(
      loginDto,
    );
  }

  // =====================================================
  // PROFILE
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    return await this.authService.getProfile(
      req.user.id,
    );
  }

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.authService.updateProfile(
      req.user.id,
      updateUserDto,
    );
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: any,
    @Body()
    changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }

  // =====================================================
  // REFRESH TOKEN
  // =====================================================

  @Post('refresh')
  async refresh(
    @Body('refresh_token')
    refreshToken: string,
  ) {
    return await this.authService.refreshToken(
      refreshToken,
    );
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    return await this.authService.logout(
      req.user.id,
    );
  }

  // =====================================================
  // FORGOT PASSWORD - SEND OTP
  // =====================================================

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
  ) {
    return await this.authService.forgotPassword(
      email,
    );
  }

  // =====================================================
  // VERIFY RESET OTP
  // =====================================================

  @Post('verify-reset-otp')
  async verifyResetOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return await this.authService.verifyResetOtp(
      email,
      otp,
    );
  }

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('password') password: string,
  ) {
    return await this.authService.resetPassword(
      email,
      otp,
      password,
    );
  }
}

