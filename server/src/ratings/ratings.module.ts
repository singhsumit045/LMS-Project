import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';

import { Rating } from './entities/rating.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rating,
      User,
      Course,
      Enrollment,
    ]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}