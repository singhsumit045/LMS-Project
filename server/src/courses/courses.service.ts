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

  async create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);

    return await this.courseRepository.save(course);
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: number) {
    return await this.courseRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.courseRepository.update(id, updateCourseDto);

    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.courseRepository.delete(id);

    return {
      message: 'Course deleted successfully',
    };
  }
}