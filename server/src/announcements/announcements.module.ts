import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';

import { Announcement } from './entities/announcement.entity';
import { User } from '../users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Announcement,
      Course,
      User,
    ]),
  ],

  controllers: [AnnouncementsController],

  providers: [AnnouncementsService],

  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}