
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CertificateController } from './certificates.controller';
import { CertificateService } from './certificates.service';

import { Certificate } from './entities/certificate.entity';

import { ExamAttempt } from '../exams/entities/exam-attempt.entity/exam-attempt.entity';

import { Exam } from '../exams/entities/exam.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certificate,
      ExamAttempt,
      Exam,
    ]),
  ],

  controllers: [
    CertificateController,
  ],

  providers: [
    CertificateService,
  ],

  exports: [
    CertificateService,
  ],
})
export class CertificatesModule {}

