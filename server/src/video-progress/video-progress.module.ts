import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideoProgress } from './entities/video-progress.entity';
import { VideoProgressService } from './video-progress.service';
import { VideoProgressController } from './video-progress.controller';

import { Video } from '../videos/video.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoProgress,
      Video,
      Enrollment,
    ]),
  ],

  controllers: [
    VideoProgressController,
  ],

  providers: [
    VideoProgressService,
  ],

  exports: [
    VideoProgressService,
  ],
})
export class VideoProgressModule {}