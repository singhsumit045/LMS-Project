
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
  Req,
  UseGuards,
} from '@nestjs/common';
import Multer from 'multer';

import { FileInterceptor } from '@nestjs/platform-express';

import { VideosService } from './videos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
// CHECK VIDEO ACCESS
// =========================

@Get(':id/access')
@UseGuards(JwtAuthGuard)
async checkVideoAccess(
  @Param('id', ParseIntPipe)
  id: number,

  @Req()
  req,
) {

  const userId = req.user.id;

  return this.videosService.checkVideoAccess(
    userId,
    id,
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
