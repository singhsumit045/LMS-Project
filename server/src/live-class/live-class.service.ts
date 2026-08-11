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

    // =====================================================
    // CREATE LIVE CLASS
    // =====================================================
    async create(
        dto: CreateLiveClassDto,
        teacherId: number,
    ): Promise<LiveClass> {
        const liveClass =
            this.liveClassRepository.create({
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

        return await this.liveClassRepository.save(
            liveClass,
        );
    }

    // =====================================================
    // GET SINGLE LIVE CLASS
    // =====================================================
    async findById(
        id: number,
    ): Promise<LiveClass> {
        const liveClass =
            await this.liveClassRepository.findOne({
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

    // =====================================================
    // TEACHER - GET MY LIVE CLASSES
    // =====================================================
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

    // =====================================================
    // STUDENT - GET AVAILABLE LIVE CLASSES
    // =====================================================
    async findForStudent(
        studentId: number,
    ): Promise<LiveClass[]> {
        // -------------------------------------------------
        // For now return active/upcoming classes.
        // Enrollment-based filtering can be added next.
        // -------------------------------------------------

        return await this.liveClassRepository
            .createQueryBuilder('liveClass')
            .where(
                'liveClass.isCancelled = :cancelled',
                {
                    cancelled: false,
                },
            )
            .andWhere(
                'liveClass.isCompleted = :completed',
                {
                    completed: false,
                },
            )
            .orderBy(
                'liveClass.isLive',
                'DESC',
            )
            .addOrderBy(
                'liveClass.scheduledAt',
                'ASC',
            )
            .getMany();
    }

    // =====================================================
    // START LIVE CLASS
    // =====================================================
    async start(
        id: number,
        teacherId: number,
    ): Promise<LiveClass> {
        const liveClass =
            await this.findById(id);

        // Ownership
        if (
            Number(liveClass.teacherId) !==
            Number(teacherId)
        ) {
            throw new ForbiddenException(
                'You are not allowed to start this live class',
            );
        }

        // Cancelled
        if (liveClass.isCancelled) {
            throw new ForbiddenException(
                'This live class has been cancelled',
            );
        }

        // Completed
        if (liveClass.isCompleted) {
            throw new ForbiddenException(
                'This live class has already ended',
            );
        }

        // Already live
        if (liveClass.isLive) {
            throw new ForbiddenException(
                'This live class is already live',
            );
        }

        // Start
        liveClass.isLive = true;
        liveClass.startedAt = new Date();

        return await this.liveClassRepository.save(
            liveClass,
        );
    }

    // =====================================================
    // END LIVE CLASS
    // =====================================================
    async end(
        id: number,
        teacherId: number,
    ): Promise<LiveClass> {
        const liveClass =
            await this.findById(id);

        // Ownership
        if (
            Number(liveClass.teacherId) !==
            Number(teacherId)
        ) {
            throw new ForbiddenException(
                'You are not allowed to end this live class',
            );
        }

        // Cancelled
        if (liveClass.isCancelled) {
            throw new ForbiddenException(
                'This live class has been cancelled',
            );
        }

        // Already completed
        if (liveClass.isCompleted) {
            throw new ForbiddenException(
                'This live class has already ended',
            );
        }

        // Must be live
        if (!liveClass.isLive) {
            throw new ForbiddenException(
                'This live class has not started yet',
            );
        }

        // End
        liveClass.isLive = false;
        liveClass.isCompleted = true;
        liveClass.endedAt = new Date();

        return await this.liveClassRepository.save(
            liveClass,
        );
    }
}