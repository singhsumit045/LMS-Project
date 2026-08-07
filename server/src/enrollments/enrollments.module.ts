import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnrollmentService } from './enrollments.service';
import { EnrollmentController } from './enrollments.controller';

import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enrollment,
      User,
      Course,
    ]),
    NotificationsModule
  ],

  controllers: [EnrollmentController],

  providers: [EnrollmentService],

  exports: [EnrollmentService],
})
export class EnrollmentsModule {}