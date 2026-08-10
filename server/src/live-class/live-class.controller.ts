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

  // ==========================================
  // TEACHER ONLY - CREATE
  // ==========================================
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

  // ==========================================
// TEACHER ONLY - MY LIVE CLASSES
// ==========================================
@Get('teacher/my-classes')
@Roles('teacher')
async findTeacherClasses(@Req() req: any) {
  const teacherId = req.user.id;

  return this.liveClassService.findByTeacher(
    teacherId,
  );
}

  // ==========================================
  // AUTHENTICATED USERS - VIEW
  // ==========================================
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.liveClassService.findById(
      Number(id),
    );
  }

  // ==========================================
  // TEACHER ONLY - START
  // ==========================================
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

  // ==========================================
  // TEACHER ONLY - END
  // ==========================================
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