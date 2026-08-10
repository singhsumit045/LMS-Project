
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LiveClass } from './entities/live-class.entity';
import { CreateLiveClassDto } from './dto/create-live-class.dto';

@Injectable()
export class LiveClassService {
  constructor(
    @InjectRepository(LiveClass)
    private readonly liveClassRepository: Repository<LiveClass>,
  ) {}

  // ======================================================
  // CREATE LIVE CLASS
  // Teacher only
  // ======================================================

  async create(
    dto: CreateLiveClassDto,
    teacherId: number,
  ): Promise<LiveClass> {
    const liveClass = this.liveClassRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      courseId: dto.courseId,
      teacherId: Number(teacherId),
      scheduledAt: dto.scheduledAt,

      startedAt: null,
      endedAt: null,

      isLive: false,
      isCompleted: false,
      isCancelled: false,
    });

    return await this.liveClassRepository.save(liveClass);
  }

  // ======================================================
  // GET LIVE CLASS BY ID
  // Authenticated users
  // ======================================================

  async findById(id: number): Promise<LiveClass> {
    const liveClass = await this.liveClassRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!liveClass) {
      throw new NotFoundException(
        'Live class not found',
      );
    }

    return liveClass;
  }

  // ======================================================
  // GET TEACHER'S LIVE CLASSES
  // Teacher only
  // ======================================================

  async findByTeacher(
    teacherId: number,
  ): Promise<LiveClass[]> {
    return await this.liveClassRepository.find({
      where: {
        teacherId: Number(teacherId),
      },
      order: {
        scheduledAt: 'DESC',
      },
    });
  }

  // ======================================================
  // START LIVE CLASS
  // Teacher only
  // ======================================================

  async start(
    id: number,
    teacherId: number,
  ): Promise<LiveClass> {
    const liveClass = await this.findById(id);

    // --------------------------------------------------
    // Check ownership
    // --------------------------------------------------

    if (
      Number(liveClass.teacherId) !==
      Number(teacherId)
    ) {
      throw new ForbiddenException(
        'You are not allowed to start this live class',
      );
    }

    // --------------------------------------------------
    // Check cancelled
    // --------------------------------------------------

    if (liveClass.isCancelled) {
      throw new ForbiddenException(
        'This live class has been cancelled',
      );
    }

    // --------------------------------------------------
    // Check completed
    // --------------------------------------------------

    if (liveClass.isCompleted) {
      throw new ForbiddenException(
        'This live class has already ended',
      );
    }

    // --------------------------------------------------
    // Check already live
    // --------------------------------------------------

    if (liveClass.isLive) {
      throw new ForbiddenException(
        'This live class is already live',
      );
    }

    // --------------------------------------------------
    // Start class
    // --------------------------------------------------

    liveClass.isLive = true;
    liveClass.startedAt = new Date();

    return await this.liveClassRepository.save(
      liveClass,
    );
  }

  // ======================================================
  // END LIVE CLASS
  // Teacher only
  // ======================================================

  async end(
    id: number,
    teacherId: number,
  ): Promise<LiveClass> {
    const liveClass = await this.findById(id);

    // --------------------------------------------------
    // Check ownership
    // --------------------------------------------------

    if (
      Number(liveClass.teacherId) !==
      Number(teacherId)
    ) {
      throw new ForbiddenException(
        'You are not allowed to end this live class',
      );
    }

    // --------------------------------------------------
    // Check cancelled
    // --------------------------------------------------

    if (liveClass.isCancelled) {
      throw new ForbiddenException(
        'This live class has been cancelled',
      );
    }

    // --------------------------------------------------
    // Check already completed
    // --------------------------------------------------

    if (liveClass.isCompleted) {
      throw new ForbiddenException(
        'This live class has already ended',
      );
    }

    // --------------------------------------------------
    // Class must be live
    // --------------------------------------------------

    if (!liveClass.isLive) {
      throw new ForbiddenException(
        'This live class has not started yet',
      );
    }

    // --------------------------------------------------
    // End class
    // --------------------------------------------------

    liveClass.isLive = false;
    liveClass.isCompleted = true;
    liveClass.endedAt = new Date();

    return await this.liveClassRepository.save(
      liveClass,
    );
  }
}

