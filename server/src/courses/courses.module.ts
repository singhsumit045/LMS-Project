
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

import { Course } from './entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Enrollment,
      User
    ]),
    NotificationsModule,
  ],

  controllers: [
    CoursesController,
  ],

  providers: [
    CoursesService,
  ],
})
export class CoursesModule {}

