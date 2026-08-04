import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
  ) {}

  // =====================================================
  // CREATE ANNOUNCEMENT
  // =====================================================

  @Post()
  createAnnouncement(
    @Req() req: any,
    @Body()
    body: {
      courseId: number;
      title: string;
      message: string;
    },
  ) {
    return this.announcementsService.createAnnouncement(
      req.user.id,
      body.courseId,
      body.title,
      body.message,
    );
  }

  // =====================================================
  // GET ANNOUNCEMENTS BY COURSE
  // =====================================================

  @Get('course/:courseId')
  getAnnouncementsByCourse(
    @Param('courseId') courseId: string,
  ) {
    return this.announcementsService.getAnnouncementsByCourse(
      Number(courseId),
    );
  }

  // =====================================================
  // GET SINGLE ANNOUNCEMENT
  // =====================================================

  @Get(':id')
  getAnnouncementById(
    @Param('id') id: string,
  ) {
    return this.announcementsService.getAnnouncementById(
      Number(id),
    );
  }

  // =====================================================
  // UPDATE ANNOUNCEMENT
  // =====================================================

  @Patch(':id')
  updateAnnouncement(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      title: string;
      message: string;
    },
  ) {
    return this.announcementsService.updateAnnouncement(
      req.user.id,
      Number(id),
      body.title,
      body.message,
    );
  }

  // =====================================================
  // DELETE ANNOUNCEMENT
  // =====================================================

  @Delete(':id')
  deleteAnnouncement(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.announcementsService.deleteAnnouncement(
      req.user.id,
      Number(id),
    );
  }
}