import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Video } from './video.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadVideo(
    file: any,
    title: string,
    description: string,
    courseId: number,
  ) {
    const result = await this.cloudinaryService.uploadVideo(file);

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
}