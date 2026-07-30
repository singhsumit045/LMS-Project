import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) {}

  // =========================
  // CREATE COURSE
  // TEACHER + ADMIN ONLY
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  // =========================
  // GET ALL COURSES
  // =========================

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // =========================
  // GET COURSE BY ID
  // =========================

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  // =========================
  // UPDATE COURSE
  // TEACHER + ADMIN ONLY
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(
      +id,
      updateCourseDto,
    );
  }

  // =========================
  // DELETE COURSE
  // TEACHER + ADMIN ONLY
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}