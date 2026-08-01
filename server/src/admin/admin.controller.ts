import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // =========================
  // ADMIN DASHBOARD
  // =========================

  @Get('dashboard')
  @Roles('admin')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  // =========================
  // GET ALL USERS
  // =========================

  @Get('users')
  @Roles('admin')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // =========================
  // DELETE USER
  // =========================

  @Delete('users/:id')
  @Roles('admin')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.adminService.deleteUser(
      id,
      req.user.id,
    );
  }
}