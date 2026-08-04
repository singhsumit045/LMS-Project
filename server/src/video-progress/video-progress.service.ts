import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VideoProgress } from './entities/video-progress.entity';
import { Video } from '../videos/video.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class VideoProgressService {
  constructor(
    @InjectRepository(VideoProgress)
    private readonly progressRepository: Repository<VideoProgress>,

    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  // =====================================================
  // UPDATE VIDEO PROGRESS
  // =====================================================

  async updateProgress(
    userId: number,
    videoId: number,
    watchedPercentage: number,
  ) {
    // ---------------------------------------------------
    // Validate percentage
    // ---------------------------------------------------

    if (
      watchedPercentage < 0 ||
      watchedPercentage > 100
    ) {
      throw new BadRequestException(
        'Watched percentage must be between 0 and 100',
      );
    }

    // ---------------------------------------------------
    // Find video
    // ---------------------------------------------------

    const video = await this.videoRepository.findOne({
      where: {
        id: videoId,
      },
    });

    if (!video) {
      throw new NotFoundException(
        'Video not found',
      );
    }

    // ---------------------------------------------------
    // Find student's enrollment for this course
    // ---------------------------------------------------

    const enrollment =
      await this.enrollmentRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          course: {
            id: video.courseId,
          },
        },
      });

    if (!enrollment) {
      throw new BadRequestException(
        'You are not enrolled in this course',
      );
    }

    // ---------------------------------------------------
    // Find existing video progress
    // ---------------------------------------------------

    let progress =
      await this.progressRepository.findOne({
        where: {
          userId,
          videoId,
        },
      });

    // ---------------------------------------------------
    // Create if doesn't exist
    // ---------------------------------------------------

    if (!progress) {
      progress =
        this.progressRepository.create({
          userId,
          videoId,
          watchedPercentage,
          completed:
            watchedPercentage >= 90,
          completedAt:
            watchedPercentage >= 90
              ? new Date()
              : null,
        });
    } else {
      // -------------------------------------------------
      // Never reduce progress
      // -------------------------------------------------

      if (
        watchedPercentage >
        progress.watchedPercentage
      ) {
        progress.watchedPercentage =
          watchedPercentage;
      }

      // -------------------------------------------------
      // Once completed, keep completed = true
      // -------------------------------------------------

      if (
        progress.watchedPercentage >= 90
      ) {
        progress.completed = true;

        if (!progress.completedAt) {
          progress.completedAt = new Date();
        }
      }
    }

    await this.progressRepository.save(progress);

    // ---------------------------------------------------
    // Update course progress
    // ---------------------------------------------------

    const courseProgress =
      await this.calculateCourseProgress(
        userId,
        video.courseId,
      );

    // ---------------------------------------------------
    // Update Enrollment
    // ---------------------------------------------------

    enrollment.progress =
      courseProgress.progress;

    enrollment.completed =
      courseProgress.progress >= 100;

    await this.enrollmentRepository.save(
      enrollment,
    );

    return {
      message: 'Video progress updated successfully',

      videoId,

      watchedPercentage:
        progress.watchedPercentage,

      videoCompleted:
        progress.completed,

      courseProgress:
        courseProgress.progress,

      completedVideos:
        courseProgress.completedVideos,

      totalVideos:
        courseProgress.totalVideos,

      courseCompleted:
        enrollment.completed,
    };
  }

  // =====================================================
  // CALCULATE COURSE PROGRESS
  // =====================================================

  async calculateCourseProgress(
    userId: number,
    courseId: number,
  ) {
    // ---------------------------------------------------
    // Get all videos of course
    // ---------------------------------------------------

    const videos =
      await this.videoRepository.find({
        where: {
          courseId,
        },
      });

    const totalVideos = videos.length;

    // ---------------------------------------------------
    // If course has no videos
    // ---------------------------------------------------

    if (totalVideos === 0) {
      return {
        progress: 0,
        completedVideos: 0,
        totalVideos: 0,
      };
    }

    // ---------------------------------------------------
    // Get completed progress records
    // ---------------------------------------------------

    const completedProgress =
      await this.progressRepository
        .createQueryBuilder('progress')
        .innerJoin(
          Video,
          'video',
          'video.id = progress.videoId',
        )
        .where(
          'progress.userId = :userId',
          { userId },
        )
        .andWhere(
          'video.courseId = :courseId',
          { courseId },
        )
        .andWhere(
          'progress.completed = :completed',
          { completed: true },
        )
        .getMany();

    const completedVideos =
      completedProgress.length;

    // ---------------------------------------------------
    // Calculate percentage
    // ---------------------------------------------------

    const progress = Math.round(
      (completedVideos / totalVideos) *
        100,
    );

    return {
      progress,
      completedVideos,
      totalVideos,
    };
  }

  // =====================================================
  // GET COURSE PROGRESS
  // =====================================================

  async getCourseProgress(
    userId: number,
    courseId: number,
  ) {
    // Check enrollment
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

    if (!enrollment) {
      throw new BadRequestException(
        'You are not enrolled in this course',
      );
    }

    const result =
      await this.calculateCourseProgress(
        userId,
        courseId,
      );

    return {
      courseId,

      progress: result.progress,

      completedVideos:
        result.completedVideos,

      totalVideos:
        result.totalVideos,

      completed:
        result.progress >= 100,
    };
  }

  // =====================================================
  // GET SINGLE VIDEO PROGRESS
  // =====================================================

  async getVideoProgress(
    userId: number,
    videoId: number,
  ) {
    const progress =
      await this.progressRepository.findOne({
        where: {
          userId,
          videoId,
        },
      });

    if (!progress) {
      return {
        videoId,
        watchedPercentage: 0,
        completed: false,
      };
    }

    return progress;
  }
}