
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { CertificateService } from './certificates.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('certificates')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
  ) {}

  // =====================================================
  // GET MY CERTIFICATES
  //
  // GET:
  // /certificates/my
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyCertificates(
    @Req() req: Request,
  ) {
    const studentId =
      (req.user as any).id;

    return this.certificateService.getMyCertificates(
      studentId,
    );
  }

  // =====================================================
  // GENERATE CERTIFICATE BY ATTEMPT
  //
  // POST:
  // /certificates/attempt/10
  //
  // IMPORTANT:
  // This is useful for old students whose exam was
  // already passed before certificate generation
  // was added.
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post('attempt/:attemptId')
  generateCertificate(
    @Param(
      'attemptId',
      ParseIntPipe,
    )
    attemptId: number,

    @Req() req: Request,
  ) {
    const studentId =
      (req.user as any).id;

    return this.certificateService.generateCertificateForAttempt(
      attemptId,
      studentId,
    );
  }

  // =====================================================
  // GET CERTIFICATE BY ATTEMPT
  //
  // GET:
  // /certificates/attempt/10
  //
  // This checks whether the student already has a
  // certificate for a particular attempt.
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('attempt/:attemptId')
  getCertificateByAttempt(
    @Param(
      'attemptId',
      ParseIntPipe,
    )
    attemptId: number,

    @Req() req: Request,
  ) {
    const studentId =
      (req.user as any).id;

    return this.certificateService.getCertificateByAttempt(
      attemptId,
      studentId,
    );
  }

  // =====================================================
  // GET CERTIFICATE FOR COURSE
  //
  // GET:
  // /certificates/course/1
  //
  // This is useful for old students.
  // Backend can find a passed attempt and create the
  // certificate if it does not already exist.
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('course/:courseId')
  getCertificateByCourse(
    @Param(
      'courseId',
      ParseIntPipe,
    )
    courseId: number,

    @Req() req: Request,
  ) {
    const studentId =
      (req.user as any).id;

    return this.certificateService.getCertificateByCourse(
      courseId,
      studentId,
    );
  }

  // =====================================================
  // GET CERTIFICATE BY ID
  //
  // IMPORTANT:
  // This route must remain LAST because :id is dynamic.
  //
  // GET:
  // /certificates/5
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getCertificateById(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Req() req: Request,
  ) {
    const studentId =
      (req.user as any).id;

    return this.certificateService.getCertificateById(
      id,
      studentId,
    );
  }
}

