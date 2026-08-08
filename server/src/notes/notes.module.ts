import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

import { Note } from './entities/note.entity';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Note,
      Enrollment
    ]),
    NotificationsModule,
    CloudinaryModule,
  ],

  controllers: [
    NotesController,
  ],

  providers: [
    NotesService,
  ],

  exports: [
    NotesService,
  ],
})
export class NotesModule {}