import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import type { Request } from 'express';

import { VideoProgressService } from './video-progress.service';
import { CreateVideoProgressDto } from './dto/create-video-progress.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('video-progress')
@UseGuards(JwtAuthGuard)
export class VideoProgressController {
  constructor(
    private readonly videoProgressService: VideoProgressService,
  ) {}

  // =====================================================
  // UPDATE / CREATE VIDEO PROGRESS
  // =====================================================

  @Post(':videoId')
  async updateProgress(
    @Param('videoId', ParseIntPipe)
    videoId: number,

    @Body()
    dto: CreateVideoProgressDto,

    @Req() req: Request,
  ) {
    const userId = Number(
      (req as any).user.id,
    );

    return await this.videoProgressService.updateProgress(
      userId,
      videoId,
      dto.watchedPercentage,
    );
  }

  // =====================================================
  // GET COURSE PROGRESS
  // =====================================================

  @Get('course/:courseId')
  async getCourseProgress(
    @Param('courseId', ParseIntPipe)
    courseId: number,

    @Req() req: Request,
  ) {
    const userId = Number(
      (req as any).user.id,
    );

    return await this.videoProgressService.getCourseProgress(
      userId,
      courseId,
    );
  }

  // =====================================================
  // GET VIDEO PROGRESS
  // =====================================================

  @Get('video/:videoId')
  async getVideoProgress(
    @Param('videoId', ParseIntPipe)
    videoId: number,

    @Req() req: Request,
  ) {
    const userId = Number(
      (req as any).user.id,
    );

    return await this.videoProgressService.getVideoProgress(
      userId,
      videoId,
    );
  }
}