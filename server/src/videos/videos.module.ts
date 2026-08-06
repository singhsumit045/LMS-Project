import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Video } from './video.entity';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Enrollment } from '../enrollments/entities/enrollment.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Video,
      Enrollment,
    ]),

    CloudinaryModule,
  ],

  controllers: [
    VideosController,
  ],

  providers: [
    VideosService,
  ],

  exports: [
    VideosService,
  ],
})
export class VideosModule {}