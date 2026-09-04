import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { LiveClassService } from './live-class.service';
import { CreateLiveClassDto } from './dto/create-live-class.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('live-classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LiveClassController {
    constructor(
        private readonly liveClassService: LiveClassService,
    ) {}

    // =====================================================
    // TEACHER - CREATE
    // POST /live-classes
    // =====================================================
    @Post()
    @Roles('teacher')
    async create(
        @Body() dto: CreateLiveClassDto,
        @Req() req: any,
    ) {
        const teacherId = req.user.id;

        return this.liveClassService.create(
            dto,
            teacherId,
        );
    }

    // =====================================================
    // TEACHER - MY LIVE CLASSES
    // GET /live-classes/teacher/my-classes
    // =====================================================
    @Get('teacher/my-classes')
    @Roles('teacher','admin')
    async findTeacherClasses(
        @Req() req: any,
    ) {
        const teacherId = req.user.id;

        return this.liveClassService.findByTeacher(
            teacherId,
        );
    }

    // =====================================================
    // STUDENT - AVAILABLE LIVE CLASSES
    // GET /live-classes/student/available
    // =====================================================
    @Get('student/available')
    @Roles('student', 'admin')
    async findStudentClasses(
        @Req() req: any,
    ) {
        const studentId = req.user.id;

        return this.liveClassService.findForStudent(
            studentId,
        );
    }

    // =====================================================
    // GET SINGLE LIVE CLASS
    // GET /live-classes/:id
    // =====================================================
    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ) {
        return this.liveClassService.findById(
            Number(id),
        );
    }

    // =====================================================
    // TEACHER - START
    // POST /live-classes/:id/start
    // =====================================================
    @Post(':id/start')
    @Roles('teacher')
    async start(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        const teacherId = req.user.id;

        return this.liveClassService.start(
            Number(id),
            teacherId,
        );
    }

    // =====================================================
    // TEACHER - END
    // POST /live-classes/:id/end
    // =====================================================
    @Post(':id/end')
    @Roles('teacher')
    async end(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        const teacherId = req.user.id;

        return this.liveClassService.end(
            Number(id),
            teacherId,
        );
    }
}