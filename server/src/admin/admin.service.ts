import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  // =========================
  // ADMIN DASHBOARD
  // =========================

  async getDashboard() {
    const totalUsers =
      await this.userRepository.count();

    const totalStudents =
      await this.userRepository.count({
        where: {
          role: 'student',
        },
      });

    const totalTeachers =
      await this.userRepository.count({
        where: {
          role: 'teacher',
        },
      });

    const totalCourses =
      await this.courseRepository.count();

    const totalEnrollments =
      await this.enrollmentRepository.count();

    return {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
    };
  }

  // =========================
  // GET ALL USERS
  // =========================

  async getAllUsers() {
    const users =
      await this.userRepository.find({
        order: {
          id: 'DESC',
        },
      });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  // =========================
  // DELETE USER
  // =========================

  async deleteUser(
    userId: number,
    adminId: number,
  ) {
    // =========================
    // ADMIN CANNOT DELETE HIMSELF
    // =========================

    if (userId === adminId) {
      throw new ForbiddenException(
        'You cannot delete your own admin account.',
      );
    }

    // =========================
    // FIND USER
    // =========================

    const user =
      await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found.',
      );
    }

    // =========================
    // DELETE USER
    // =========================

    await this.userRepository.remove(user);

    return {
      message: 'User deleted successfully.',
      deletedUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}