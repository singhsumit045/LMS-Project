import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LiveClass } from './entities/live-class.entity';
import { LiveClassController } from './live-class.controller';
import { LiveClassService } from './live-class.service';
import { ZoomMeetingService } from './zoom-meeting.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LiveClass,
    ]),

    AuthModule,
  ],

  controllers: [
    LiveClassController,
  ],

  providers: [
    LiveClassService,
    ZoomMeetingService,
  ],

  exports: [
    LiveClassService,
  ],
})
export class LiveClassModule {}