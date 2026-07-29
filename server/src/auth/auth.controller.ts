import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================
  // REGISTER
 
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // =========================
  // LOGIN
  
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }


  // PROFILE

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    return req.user;
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  // =========================
  // LOGOUT
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    return await this.authService.logout(req.user.sub);
  }
}