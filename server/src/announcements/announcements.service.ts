import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Announcement } from './entities/announcement.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // =====================================================
  // CREATE ANNOUNCEMENT
  // =====================================================

  async createAnnouncement(
    teacherId: number,
    courseId: number,
    title: string,
    message: string,
  ) {
    const course = await this.courseRepository.findOne({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check course ownership
    if (Number(course.teacherId) !== Number(teacherId)) {
      throw new ForbiddenException(
        'You can only create announcements for your own course',
      );
    }

    const announcement = this.announcementRepository.create({
      title,
      message,
      courseId,
      teacherId,
    });

    return this.announcementRepository.save(announcement);
  }

  // =====================================================
  // GET ANNOUNCEMENTS BY COURSE
  // =====================================================

  async getAnnouncementsByCourse(courseId: number) {
    return this.announcementRepository.find({
      where: {
        courseId,
      },
      relations: {
        teacher: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =====================================================
  // GET SINGLE ANNOUNCEMENT
  // =====================================================

  async getAnnouncementById(id: number) {
    const announcement =
      await this.announcementRepository.findOne({
        where: {
          id,
        },
        relations: {
          teacher: true,
          course: true,
        },
      });

    if (!announcement) {
      throw new NotFoundException(
        'Announcement not found',
      );
    }

    return announcement;
  }

  // =====================================================
  // UPDATE ANNOUNCEMENT
  // =====================================================

  async updateAnnouncement(
    teacherId: number,
    id: number,
    title: string,
    message: string,
  ) {
    const announcement =
      await this.announcementRepository.findOne({
        where: {
          id,
        },
      });

    if (!announcement) {
      throw new NotFoundException(
        'Announcement not found',
      );
    }

    // Check ownership
    if (
      Number(announcement.teacherId) !==
      Number(teacherId)
    ) {
      throw new ForbiddenException(
        'You can only update your own announcements',
      );
    }

    announcement.title = title;
    announcement.message = message;

    return this.announcementRepository.save(
      announcement,
    );
  }

  // =====================================================
  // DELETE ANNOUNCEMENT
  // =====================================================

  async deleteAnnouncement(
    teacherId: number,
    id: number,
  ) {
    const announcement =
      await this.announcementRepository.findOne({
        where: {
          id,
        },
      });

    if (!announcement) {
      throw new NotFoundException(
        'Announcement not found',
      );
    }

    // Check ownership
    if (
      Number(announcement.teacherId) !==
      Number(teacherId)
    ) {
      throw new ForbiddenException(
        'You can only delete your own announcements',
      );
    }

    await this.announcementRepository.remove(
      announcement,
    );

    return {
      message: 'Announcement deleted successfully',
    };
  }
}