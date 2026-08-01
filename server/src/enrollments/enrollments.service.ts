import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // =====================================================
  // STUDENT ENROLL
  // POST /enrollments
  // =====================================================

  async createEnrollment(
    userId: number,
    courseId: number,
  ) {
    // Find student
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    // Find course
    const course = await this.courseRepository.findOne({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new NotFoundException(
        'Course not found',
      );
    }

    // Prevent duplicate enrollment
    const existingEnrollment =
      await this.enrollmentRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          course: {
            id: courseId,
          },
        },
      });

    if (existingEnrollment) {
      throw new BadRequestException(
        'You are already enrolled in this course',
      );
    }

    // Create enrollment
    const enrollment =
      this.enrollmentRepository.create({
        user,
        course,
        progress: 0,
        completed: false,
      });

    const savedEnrollment =
      await this.enrollmentRepository.save(
        enrollment,
      );

    return {
      message: 'Course enrolled successfully',
      enrollment: savedEnrollment,
    };
  }

  // =====================================================
  // STUDENT MY COURSES
  // GET /enrollments/my-courses
  // =====================================================

  async getMyCourses(userId: number) {
    const enrollments =
      await this.enrollmentRepository.find({
        where: {
          user: {
            id: userId,
          },
        },

        relations: {
          course: true,
        },

        order: {
          enrolledAt: 'DESC',
        },
      });

    return enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,

      progress: enrollment.progress,

      completed: enrollment.completed,

      enrolledAt: enrollment.enrolledAt,

      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description:
          enrollment.course.description,
        thumbnail:
          enrollment.course.thumbnail || null,
        price: Number(enrollment.course.price),
        category: enrollment.course.category,
      },
    }));
  }

  // =====================================================
  // TEACHER DASHBOARD
  // =====================================================

  async getTeacherDashboard(
    teacherId: number,
  ) {
    // =====================================================
    // GET ALL COURSES CREATED BY THIS TEACHER
    // =====================================================

    const teacherCourses =
      await this.courseRepository.find({
        where: {
          teacherId,
        },

        order: {
          createdAt: 'DESC',
        },
      });

    // =====================================================
    // GET ALL ENROLLMENTS FROM TEACHER COURSES
    // =====================================================

    const enrollments =
      await this.enrollmentRepository.find({
        where: {
          course: {
            teacherId,
          },
        },

        relations: {
          user: true,
          course: true,
        },

        order: {
          enrolledAt: 'DESC',
        },
      });

    // =====================================================
    // UNIQUE STUDENTS
    // =====================================================

    const studentMap = new Map<
      number,
      {
        id: number;
        name: string;
        courses: {
          id: number;
          title: string;
        }[];
      }
    >();

    for (const enrollment of enrollments) {
      const student = enrollment.user;
      const course = enrollment.course;

      if (!student || !course) {
        continue;
      }

      if (!studentMap.has(student.id)) {
        studentMap.set(student.id, {
          id: student.id,
          name: student.name,
          courses: [],
        });
      }

      const studentData =
        studentMap.get(student.id)!;

      const alreadyEnrolled =
        studentData.courses.some(
          (item) => item.id === course.id,
        );

      if (!alreadyEnrolled) {
        studentData.courses.push({
          id: course.id,
          title: course.title,
        });
      }
    }

    const students =
      Array.from(studentMap.values());

    // =====================================================
    // COURSES
    // =====================================================

    const courseMap = new Map<
      number,
      {
        id: number;
        title: string;
        description: string;
        thumbnail: string | null;
        price: number;
        category: string;
        students: {
          id: number;
          name: string;
        }[];
      }
    >();

    // Add ALL teacher courses
    for (const course of teacherCourses) {
      courseMap.set(course.id, {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail || null,
        price: Number(course.price),
        category: course.category,
        students: [],
      });
    }

    // Add enrolled students
    for (const enrollment of enrollments) {
      const course = enrollment.course;
      const student = enrollment.user;

      if (!course || !student) {
        continue;
      }

      const courseData =
        courseMap.get(course.id);

      if (!courseData) {
        continue;
      }

      const alreadyAdded =
        courseData.students.some(
          (item) => item.id === student.id,
        );

      if (!alreadyAdded) {
        courseData.students.push({
          id: student.id,
          name: student.name,
        });
      }
    }

    const courses =
      Array.from(courseMap.values());

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
      totalCourses: teacherCourses.length,

      totalStudents: students.length,

      students,

      courses,
    };
  }
}