import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';

import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentsService.create(
      req.user.id,
      createEnrollmentDto.courseId,
    );
  }
  // =========================
  // MY COURSES
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  findMyCourses(@Request() req) {
    return this.enrollmentsService.findMyCourses(
      req.user.id,
    );
  }

  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(
      +id,
      updateEnrollmentDto.progress,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}