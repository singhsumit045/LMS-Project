
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Video } from './video.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Injectable()
export class VideosService {
 constructor(
  @InjectRepository(Video)
  private readonly videoRepository: Repository<Video>,

  private readonly cloudinaryService: CloudinaryService,

  @InjectRepository(Enrollment)
  private readonly enrollmentRepository: Repository<Enrollment>,
) {}

  // =========================
  // UPLOAD VIDEO
  // =========================

  async uploadVideo(
    file: any,
    title: string,
    description: string,
    courseId: number,
  ) {
    const result =
      await this.cloudinaryService.uploadVideo(file);

    const video = this.videoRepository.create({
      title,
      description,
      videoUrl: result.secure_url,
      publicId: result.public_id,
      courseId,
      duration: result.duration,
    });

    return this.videoRepository.save(video);
  }

  // =========================
  // GET VIDEOS BY COURSE
  // =========================

  async getVideosByCourse(courseId: number) {
    return this.videoRepository.find({
      where: {
        courseId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }


  // =========================
// CHECK VIDEO ACCESS
// =========================

async checkVideoAccess(
  userId: number,
  videoId: number,
) {

  const video =
    await this.videoRepository.findOne({
      where: {
        id: videoId,
      },
    });


  if (!video) {
    throw new NotFoundException(
      'Video not found',
    );
  }


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
    return {
      allowed: false,
      message:
        'Please enroll in this course first',
    };
  }


  return {
    allowed: true,
  };
}

  // =========================
  // DELETE VIDEO
  // =========================

  async deleteVideo(id: number) {
    const video =
      await this.videoRepository.findOne({
        where: {
          id,
        },
      });

    if (!video) {
      throw new NotFoundException(
        'Video not found.',
      );
    }

    // =========================
    // DELETE FROM CLOUDINARY
    // =========================

    if (video.publicId) {
      await this.cloudinaryService.deleteFile(
        video.publicId,
        'video',
      );
    }

    // =========================
    // DELETE FROM DATABASE
    // =========================

    await this.videoRepository.delete(id);

    return {
      message:
        'Video deleted successfully.',
    };
  }
}

