import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LiveClass } from './entities/live-class.entity';
import { LiveClassController } from './live-class.controller';
import { LiveClassService } from './live-class.service';
import { LiveClassGateway } from './live-class.gateway';

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
    LiveClassGateway,
  ],

  exports: [
    LiveClassService,
  ],
})
export class LiveClassModule {}