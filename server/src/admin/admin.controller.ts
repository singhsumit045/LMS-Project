import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Patch, Body } from '@nestjs/common'; // existing @nestjs/common import line mein merge karo
import { UsersService } from '../users/users.service';
import { UpdateRoleDto } from '../users/dto/update-role.dto';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) { }

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

  // =========================
  // UPDATE USER ROLE
  // =========================

  @Patch('users/:id/role')
  @Roles('admin')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(id, dto.role);
  }
}