
import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseIntPipe,
  Param,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { VideosService } from './videos.service';
import multer from 'multer';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  // =========================
  // UPLOAD VIDEO
  // =========================

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.videosService.uploadVideo(
      file,
      title,
      description,
      courseId,
    );
  }

  // =========================
  // GET VIDEOS BY COURSE
  // =========================

  @Get('course/:courseId')
  async getVideosByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.videosService.getVideosByCourse(courseId);
  }
}

export default VideosController;

