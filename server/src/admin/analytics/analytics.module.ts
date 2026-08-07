import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      Enrollment,
      Rating,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}