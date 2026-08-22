import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // ============================================================
  // GET ALL NOTIFICATIONS
  // ============================================================

  @Get()
  getMyNotifications(@Req() req) {
    return this.notificationsService.getMyNotifications(
      req.user.id,
    );
  }

  // ============================================================
  // GET UNREAD COUNT
  // ============================================================

  @Get('unread-count')
  getUnreadCount(@Req() req) {
    return this.notificationsService.getUnreadCount(
      req.user.id,
    );
  }

  // ============================================================
  // MARK ALL AS READ
  // IMPORTANT: keep before :id routes
  // ============================================================

  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(
      req.user.id,
    );
  }

  // ============================================================
  // CLEAR ALL NOTIFICATIONS
  // IMPORTANT: keep BEFORE @Delete(':id')
  // ============================================================

  @Delete('clear')
  clearAllNotifications(@Req() req) {
    return this.notificationsService.clearAllNotifications(
      req.user.id,
    );
  }

  // ============================================================
  // MARK SINGLE NOTIFICATION AS READ
  // ============================================================

  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.notificationsService.markAsRead(
      id,
      req.user.id,
    );
  }

  // ============================================================
  // DELETE SINGLE NOTIFICATION
  // ============================================================

  @Delete(':id')
  deleteNotification(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.notificationsService.deleteNotification(
      id,
      req.user.id,
    );
  }
}