import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // =========================
  // CREATE ENROLLMENT
  // =========================

  async create(userId: number, courseId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingEnrollment =
      await this.enrollmentRepository.findOne({
        where: {
          user: { id: userId },
          course: { id: courseId },
        },
      });

    if (existingEnrollment) {
      throw new ConflictException(
        'You are already enrolled in this course',
      );
    }

    const enrollment = this.enrollmentRepository.create({
      user,
      course,
      progress: 0,
      completed: false,
    });

    return this.enrollmentRepository.save(enrollment);
  }

  // =========================
  // GET ALL ENROLLMENTS
  // =========================

  async findAll() {
    return this.enrollmentRepository.find({
      relations: {
        user: true,
        course: true,
      },
    });
  }

  // =========================
  // GET MY COURSES
  // =========================

  async findMyCourses(userId: number) {
    return this.enrollmentRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        course: true,
      },
    });
  }

  // =========================
  // GET ONE ENROLLMENT
  // =========================

  async findOne(id: number) {
    const enrollment =
      await this.enrollmentRepository.findOne({
        where: { id },
        relations: {
          user: true,
          course: true,
        },
      });

    if (!enrollment) {
      throw new NotFoundException(
        'Enrollment not found',
      );
    }

    return enrollment;
  }

  // =========================
  // UPDATE PROGRESS
  // =========================

  async update(id: number, progress: number) {
    const enrollment =
      await this.enrollmentRepository.findOne({
        where: { id },
      });

    if (!enrollment) {
      throw new NotFoundException(
        'Enrollment not found',
      );
    }

    if (progress < 0 || progress > 100) {
      throw new ConflictException(
        'Progress must be between 0 and 100',
      );
    }

    enrollment.progress = progress;

    if (progress === 100) {
      enrollment.completed = true;
    }

    return this.enrollmentRepository.save(enrollment);
  }

  // =========================
  // DELETE ENROLLMENT
  // =========================

  async remove(id: number) {
    const enrollment =
      await this.enrollmentRepository.findOne({
        where: { id },
      });

    if (!enrollment) {
      throw new NotFoundException(
        'Enrollment not found',
      );
    }

    await this.enrollmentRepository.remove(enrollment);

    return {
      message: 'Enrollment removed successfully',
    };
  }
}