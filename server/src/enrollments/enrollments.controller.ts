import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';

import { EnrollmentService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('enrollments')
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
  ) {}

  // =====================================================
  // STUDENT ENROLL
  // POST /enrollments
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post()
  createEnrollment(
    @Req() req: any,
    @Body() body: { courseId: number },
  ) {
    return this.enrollmentService.createEnrollment(
      req.user.id,
      body.courseId,
    );
  }

  // =====================================================
  // STUDENT MY COURSES
  // GET /enrollments/my-courses
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  getMyCourses(@Req() req: any) {
    return this.enrollmentService.getMyCourses(
      req.user.id,
    );
  }

  // =====================================================
  // TEACHER DASHBOARD
  // GET /enrollments/teacher/dashboard
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('teacher/dashboard')
  getTeacherDashboard(@Req() req: any) {
    return this.enrollmentService.getTeacherDashboard(
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin')
getAllEnrollmentsForAdmin() {
  return this.enrollmentService.getAllEnrollmentsForAdmin();
}

// =====================================================
// ADMIN — REMOVE ENROLLMENT
// DELETE /enrollments/admin/:id
// =====================================================

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete('admin/:id')
removeEnrollmentForAdmin(
  @Param('id') id: string,
) {
  return this.enrollmentService.removeEnrollmentForAdmin(
    Number(id),
  );
}
}