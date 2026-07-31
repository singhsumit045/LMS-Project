import {
Controller,
Get,
Req,    
UseGuards,
} from '@nestjs/common';

import { EnrollmentService } from './enrollments.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('enrollments')
export class EnrollmentController {
constructor(
private readonly enrollmentService: EnrollmentService,
) {}

// =====================================================
// TEACHER DASHBOARD
// =====================================================

@UseGuards(JwtAuthGuard)
@Get('teacher/dashboard')
getTeacherDashboard(@Req() req: any) {
return this.enrollmentService.getTeacherDashboard(
req.user.id,
);
}
}
