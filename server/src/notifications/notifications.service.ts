import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { NotificationType } from './enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(
    userId: number,
    title: string,
    message: string,
    type: NotificationType,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      title,
      message,
      type,
      user,
    });

    return this.notificationRepository.save(notification);
  }

  async getMyNotifications(userId: number) {
    return this.notificationRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getUnreadCount(userId: number) {
    return this.notificationRepository.count({
      where: {
        user: {
          id: userId,
        },
        isRead: false,
      },
    });
  }
            
  async markAsRead(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;

    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: {
        user: {
          id: userId,
        },
        isRead: false,
      },
    });

    notifications.forEach((notification) => {
      notification.isRead = true;
    });

    await this.notificationRepository.save(notifications);

    return {
      message: 'All notifications marked as read',
    };
  }

  async deleteNotification(
  id: number,
  userId: number,
) {
  const notification =
    await this.notificationRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

  if (!notification) {
    throw new NotFoundException(
      'Notification not found',
    );
  }

  await this.notificationRepository.remove(
    notification,
  );

  return {
    message: 'Notification deleted successfully',
    deletedId: id,
  };
}

  async clearAllNotifications(userId: number) {
  const result = await this.notificationRepository.delete({
    user: {
      id: userId,
    },
  });

  return {
    message: 'All notifications cleared successfully',
    deletedCount: result.affected ?? 0,
  };
}
}