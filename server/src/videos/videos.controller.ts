
import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import Multer from 'multer';

import { FileInterceptor } from '@nestjs/platform-express';

import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
  ) {}

  // =========================
  // UPLOAD VIDEO
  // =========================

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile()
    file: Express.Multer.File,

    @Body('title')
    title: string,

    @Body('description')
    description: string,

    @Body('courseId', ParseIntPipe)
    courseId: number,
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
    @Param('courseId', ParseIntPipe)
    courseId: number,
  ) {
    return this.videosService.getVideosByCourse(
      courseId,
    );
  }

  // =========================
  // DELETE VIDEO
  // =========================

  @Delete(':id')
  async deleteVideo(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.videosService.deleteVideo(id);
  }
}

export default VideosController;
