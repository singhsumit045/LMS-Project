import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VideosModule } from './videos/videos.module';
import { AdminModule } from './admin/admin.module';
import { PresenceModule } from './presence/presence.module';
import { NotesModule } from './notes/notes.module';
import { VideoProgressModule } from './video-progress/video-progress.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ExamsModule } from './exams/exams.module';
import { CertificatesModule } from './certificates/certificates.module';
import { RatingsModule } from './ratings/ratings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { LiveClassModule } from './live-class/live-class.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudinaryModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    VideosModule,
    AdminModule,
    PresenceModule,
    NotesModule,
    VideoProgressModule,
    AnnouncementsModule,
    ExamsModule,
    CertificatesModule,
    RatingsModule,
    NotificationsModule,
    MailModule,
    LiveClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}