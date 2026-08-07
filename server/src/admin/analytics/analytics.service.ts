import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Rating } from '../../ratings/entities/rating.entity';


@Injectable()
export class AnalyticsService {


  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>,


    @InjectRepository(Course)
    private courseRepository: Repository<Course>,


    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,


    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,

  ) {}



  // =====================================================
  // OVERVIEW CARDS
  // =====================================================

  async getOverview() {


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
  // =====================================================
  // USER GROWTH GRAPH
  // =====================================================

async getUserGrowth() {

  const users =
    await this.userRepository.find({
      select: {
        createdAt: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });


  const monthlyData: any = {};

  users.forEach((user) => {

    if (!user.createdAt) return;

    const month =
      new Date(user.createdAt)
        .toLocaleString('default', {
          month: 'short',
        });

    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }
    monthlyData[month]++;

  });


  return Object.keys(monthlyData).map(
    (month) => ({
      month,
      users: monthlyData[month],
    }),
  );

}

async getCourseEnrollment(){

  const enrollments =
    await this.enrollmentRepository
    .createQueryBuilder('enrollment')
    .leftJoinAndSelect(
      'enrollment.course',
      'course'
    )
    .select('course.title','course')
    .addSelect(
      'COUNT(enrollment.id)',
      'students'
    )
    .groupBy('course.id')
    .getRawMany();


  return enrollments.map((item)=>({

    course: item.course,

    students: Number(item.students),

  }));
}

async getTopCourses() {

  const courses =
    await this.enrollmentRepository
      .createQueryBuilder('enrollment')

      .leftJoinAndSelect(
        'enrollment.course',
        'course'
      )

      .select(
        'course.title',
        'course'
      )

      .addSelect(
        'COUNT(enrollment.id)',
        'students'
      )

      .groupBy('course.id')

      .orderBy(
        'students',
        'DESC'
      )

      .limit(5)

      .getRawMany();



  return courses.map((item) => ({

    course: item.course,

    students: Number(item.students),

  }));

}

}