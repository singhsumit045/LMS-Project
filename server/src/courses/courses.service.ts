
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  // =====================================================
  // CREATE COURSE
  // =====================================================

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

  // =====================================================
  // GET ALL COURSES
  // =====================================================

  async findAll() {
    return await this.courseRepository.find();
  }

  // =====================================================
  // ADMIN — GET ALL COURSES
  // GET /courses/admin
  // =====================================================

  async getAllCoursesForAdmin() {
    const courses =
      await this.courseRepository.find({
        relations: {
          teacher: true,
        },

        order: {
          createdAt: 'DESC',
        },
      });

    const coursesWithStudentCount =
      await Promise.all(
        courses.map(async (course) => {
          const studentCount =
            await this.enrollmentRepository.count({
              where: {
                course: {
                  id: course.id,
                },
              },
            });

          return {
            id: course.id,

            title: course.title,

            description:
              course.description,

            thumbnail:
              course.thumbnail || null,

            price: Number(course.price),

            category: course.category,

            teacher: course.teacher
              ? {
                  id: course.teacher.id,
                  name: course.teacher.name,
                  email: course.teacher.email,
                  profileImageUrl: course.teacher.profileImageUrl || null,
                }
              : null,

            studentCount,

            createdAt: course.createdAt,

            updatedAt: course.updatedAt,
          };
        }),
      );

    return coursesWithStudentCount;
  }

  // =====================================================
  // GET COURSE BY ID
  // =====================================================

  async findOne(id: number) {
    return await this.courseRepository.findOne({
      where: {
        id,
      },
    });
  }

  // =====================================================
  // GET TEACHER COURSES
  // =====================================================

  async findMyCourses(
    teacherId: number,
  ) {
    return await this.courseRepository.find({
      where: {
        teacherId,
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =====================================================
  // UPDATE COURSE
  // =====================================================

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

  // =====================================================
  // DELETE COURSE
  // =====================================================

  async remove(id: number) {
    await this.courseRepository.delete(id);

    return {
      message: 'Course deleted successfully',
    };
  }
}

