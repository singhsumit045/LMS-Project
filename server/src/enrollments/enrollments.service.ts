
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // =====================================================
  // TEACHER DASHBOARD
  // =====================================================

  async getTeacherDashboard(teacherId: number) {
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

    // First add ALL teacher courses
    // Even if there are zero students

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

    // Then add enrolled students
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

