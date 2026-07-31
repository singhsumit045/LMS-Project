import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // =========================
  // CREATE COURSE
  // =========================

  async create(
    createCourseDto: CreateCourseDto,
    teacherId: number,
  ) {
    const course = this.courseRepository.create({
      ...createCourseDto,
      teacherId,
    });

    return await this.courseRepository.save(course);
  }

  // =========================
  // GET ALL COURSES
  // =========================

  async findAll() {
    return await this.courseRepository.find();
  }

  // =========================
  // GET COURSE BY ID
  // =========================

  async findOne(id: number) {
    return await this.courseRepository.findOne({
      where: { id },
    });
  }

  // =========================
  // GET TEACHER COURSES
  // =========================

  async findMyCourses(teacherId: number) {
    return await this.courseRepository.find({
      where: {
        teacherId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =========================
  // UPDATE COURSE
  // =========================

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ) {
    await this.courseRepository.update(
      id,
      updateCourseDto,
    );

    return await this.findOne(id);
  }

  // =========================
  // DELETE COURSE
  // =========================

  async remove(id: number) {
    await this.courseRepository.delete(id);

    return {
      message: 'Course deleted successfully',
    };
  }
}