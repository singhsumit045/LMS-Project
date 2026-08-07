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
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

     private readonly notificationsService: NotificationsService,
  ) {}

  // =====================================================
// ADMIN — REMOVE ENROLLMENT
// DELETE /enrollments/admin/:id
// =====================================================

async removeEnrollmentForAdmin(enrollmentId: number) {
  const enrollment =
    await this.enrollmentRepository.findOne({
      where: {
        id: enrollmentId,
      },
    });

  if (!enrollment) {
    throw new NotFoundException(
      'Enrollment not found',
    );
  }

  await this.enrollmentRepository.remove(
    enrollment,
  );

  return {
    message: 'Enrollment removed successfully',
  };
}

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

// Create Notification
try {
  await this.notificationsService.createNotification(
    user.id,
    'Course Enrolled',
    `You have successfully enrolled in "${course.title}".`,
    NotificationType.ENROLLMENT,
  );

  if (course.teacherId !== user.id) {
    await this.notificationsService.createNotification(
      course.teacherId,
      'New Student Enrolled',
      `${user.name} enrolled in your course "${course.title}".`,
      NotificationType.ENROLLMENT,
    );
  }
} catch (error) {
  console.error(
  'Notification Error:',
  error instanceof Error ? error.message : error,
);
}

return {
  message: 'Course enrolled successfully',
  enrollment: savedEnrollment,
};
  }

  // =====================================================
// CHECK USER ENROLLMENT
// =====================================================

async checkEnrollment(
  userId: number,
  courseId: number,
) {
  const enrollment =
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

  return !!enrollment;
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
  // ADMIN — GET ALL ENROLLMENTS
  // GET /enrollments/admin
  // =====================================================

  async getAllEnrollmentsForAdmin() {
    const enrollments =
      await this.enrollmentRepository.find({
        relations: {
          user: true,
          course: {
            teacher: true,
          },
        },

        order: {
          enrolledAt: 'DESC',
        },
      });

    return enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,

      student: {
        id: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
      },

      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
      },

      teacher: enrollment.course.teacher
        ? {
            id: enrollment.course.teacher.id,
            name: enrollment.course.teacher.name,
          }
        : null,

      progress: enrollment.progress,

      completed: enrollment.completed,

      status: enrollment.completed
        ? 'Completed'
        : 'In Progress',

      enrolledAt: enrollment.enrolledAt,
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