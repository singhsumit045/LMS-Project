
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Certificate } from './entities/certificate.entity';

import { ExamAttempt } from '../exams/entities/exam-attempt.entity/exam-attempt.entity';

import { Exam } from '../exams/entities/exam.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,

    @InjectRepository(ExamAttempt)
    private readonly examAttemptRepository: Repository<ExamAttempt>,

    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  // =====================================================
  // GENERATE CERTIFICATE NUMBER
  // =====================================================

  private generateCertificateNumber(): string {
    const timestamp = Date.now();

    const random = Math.floor(
      1000 + Math.random() * 9000,
    );

    return `LH-${timestamp}-${random}`;
  }

  // =====================================================
  // GET COMPLETE CERTIFICATE
  // =====================================================

  private async getCompleteCertificate(
    certificateId: number,
  ): Promise<Certificate> {
    const certificate =
      await this.certificateRepository.findOne({
        where: {
          id: certificateId,
        },

        relations: {
          student: true,
          exam: true,
          attempt: true,
          course: true,
        },
      });

    if (!certificate) {
      throw new NotFoundException(
        'Certificate not found.',
      );
    }

    return certificate;
  }

  // =====================================================
  // GET OR CREATE CERTIFICATE FOR COURSE
  //
  // IMPORTANT:
  //
  // This handles old students also.
  //
  // Example:
  //
  // Attempt 1 -> Failed
  // Attempt 2 -> Failed
  // Attempt 3 -> Passed
  // Attempt 4 -> Failed
  // Attempt 5 -> Failed
  //
  // Certificate will be generated from Attempt 3.
  // =====================================================

  async getOrCreateCertificate(
    studentId: number,
    courseId: number,
  ): Promise<Certificate> {

    // ===================================================
    // STEP 1: CHECK EXISTING CERTIFICATE
    // ===================================================

    const existingCertificate =
      await this.certificateRepository.findOne({
        where: {
          studentId,
          courseId,
        },

        relations: {
          student: true,
          exam: true,
          attempt: true,
          course: true,
        },
      });

    if (existingCertificate) {
      return existingCertificate;
    }

    // ===================================================
    // STEP 2: FIND EXAMS OF COURSE
    // ===================================================

    const exams =
      await this.examRepository.find({
        where: {
          courseId,
        },
      });

    if (exams.length === 0) {
      throw new NotFoundException(
        'No exam found for this course.',
      );
    }

    const examIds = exams.map(
      (exam) => exam.id,
    );

    // ===================================================
    // STEP 3: FIND PASSED ATTEMPT
    //
    // We search all submitted attempts.
    //
    // Therefore even if student has already used
    // all 5 attempts, previous passed attempt
    // can still be found.
    // ===================================================

    const passedAttempt =
      await this.examAttemptRepository
        .createQueryBuilder('attempt')

        .leftJoinAndSelect(
          'attempt.exam',
          'exam',
        )

        .leftJoinAndSelect(
          'attempt.student',
          'student',
        )

        .where(
          'attempt.studentId = :studentId',
          {
            studentId,
          },
        )

        .andWhere(
          'attempt.submitted = :submitted',
          {
            submitted: true,
          },
        )

        .andWhere(
          'attempt.passed = :passed',
          {
            passed: true,
          },
        )

        .andWhere(
          'attempt.examId IN (:...examIds)',
          {
            examIds,
          },
        )

        // Oldest passed attempt
        .orderBy(
          'attempt.createdAt',
          'ASC',
        )

        .getOne();

    // ===================================================
    // STEP 4: NO PASSED ATTEMPT
    // ===================================================

    if (!passedAttempt) {
      throw new BadRequestException(
        'Certificate is available only after passing the exam.',
      );
    }

    // ===================================================
    // STEP 5: CREATE CERTIFICATE
    // ===================================================

    const certificate =
      this.certificateRepository.create({
        certificateNumber:
          this.generateCertificateNumber(),

        studentId,

        examId:
          passedAttempt.examId,

        attemptId:
          passedAttempt.id,

        courseId,

        score: Number(
          passedAttempt.score || 0,
        ),

        percentage: Number(
          passedAttempt.percentage || 0,
        ),
      });

    // ===================================================
    // STEP 6: SAVE CERTIFICATE
    // ===================================================

    const savedCertificate =
      await this.certificateRepository.save(
        certificate,
      );

    console.log(
      'Certificate created:',
      savedCertificate.certificateNumber,
    );

    // ===================================================
    // STEP 7: RETURN COMPLETE CERTIFICATE
    // ===================================================

    return this.getCompleteCertificate(
      savedCertificate.id,
    );
  }

  // =====================================================
  // GENERATE CERTIFICATE FOR SPECIFIC ATTEMPT
  //
  // POST:
  // /certificates/attempt/:attemptId
  //
  // This is useful for old students.
  // =====================================================

  async generateCertificateForAttempt(
    attemptId: number,
    studentId: number,
  ): Promise<Certificate> {

    // ===================================================
    // STEP 1: FIND ATTEMPT
    // ===================================================

    const attempt =
      await this.examAttemptRepository.findOne({
        where: {
          id: attemptId,
        },

        relations: {
          exam: true,
          student: true,
        },
      });

    if (!attempt) {
      throw new NotFoundException(
        'Exam attempt not found.',
      );
    }

    // ===================================================
    // SECURITY CHECK
    //
    // Student can only generate certificate
    // for his own attempt.
    // ===================================================

    if (
      Number(attempt.studentId) !==
      Number(studentId)
    ) {
      throw new BadRequestException(
        'You are not allowed to generate certificate for this attempt.',
      );
    }

    // ===================================================
    // MUST BE SUBMITTED
    // ===================================================

    if (!attempt.submitted) {
      throw new BadRequestException(
        'Certificate cannot be generated before submitting the exam.',
      );
    }

    // ===================================================
    // MUST BE PASSED
    // ===================================================

    if (!attempt.passed) {
      throw new BadRequestException(
        'Certificate is available only for passed exams.',
      );
    }

    // ===================================================
    // CHECK EXISTING CERTIFICATE FOR THIS ATTEMPT
    // ===================================================

    const existingCertificate =
      await this.certificateRepository.findOne({
        where: {
          studentId,
          attemptId,
        },

        relations: {
          student: true,
          exam: true,
          attempt: true,
          course: true,
        },
      });

    if (existingCertificate) {
      return existingCertificate;
    }

    // ===================================================
    // CREATE CERTIFICATE
    // ===================================================

    const certificate =
      this.certificateRepository.create({
        certificateNumber:
          this.generateCertificateNumber(),

        studentId,

        examId:
          attempt.examId,

        attemptId:
          attempt.id,

        courseId:
          attempt.exam.courseId,

        score: Number(
          attempt.score || 0,
        ),

        percentage: Number(
          attempt.percentage || 0,
        ),
      });

    const savedCertificate =
      await this.certificateRepository.save(
        certificate,
      );

    console.log(
      'Certificate generated for attempt:',
      attemptId,
    );

    return this.getCompleteCertificate(
      savedCertificate.id,
    );
  }

  // =====================================================
  // GET CERTIFICATE BY ATTEMPT
  //
  // GET:
  // /certificates/attempt/:attemptId
  // =====================================================

  async getCertificateByAttempt(
    attemptId: number,
    studentId: number,
  ): Promise<Certificate> {

    // ===================================================
    // FIND CERTIFICATE
    // ===================================================

    const certificate =
      await this.certificateRepository.findOne({
        where: {
          attemptId,
          studentId,
        },

        relations: {
          student: true,
          exam: true,
          attempt: true,
          course: true,
        },
      });

    if (certificate) {
      return certificate;
    }

    // ===================================================
    // CERTIFICATE DOESN'T EXIST
    //
    // Check whether this attempt was passed.
    // If yes, automatically create certificate.
    // This is important for old students.
    // ===================================================

    const attempt =
      await this.examAttemptRepository.findOne({
        where: {
          id: attemptId,
          studentId,
        },

        relations: {
          exam: true,
          student: true,
        },
      });

    if (!attempt) {
      throw new NotFoundException(
        'Exam attempt not found.',
      );
    }

    if (!attempt.submitted) {
      throw new BadRequestException(
        'Exam has not been submitted yet.',
      );
    }

    if (!attempt.passed) {
      throw new BadRequestException(
        'Certificate is available only after passing the exam.',
      );
    }

    // ===================================================
    // CREATE CERTIFICATE
    // ===================================================

    return this.generateCertificateForAttempt(
      attemptId,
      studentId,
    );
  }

  // =====================================================
  // GET CERTIFICATE BY ID
  // =====================================================

  async getCertificateById(
    certificateId: number,
    studentId: number,
  ): Promise<Certificate> {

    const certificate =
      await this.certificateRepository.findOne({
        where: {
          id: certificateId,
          studentId,
        },

        relations: {
          student: true,
          exam: true,
          attempt: true,
          course: true,
        },
      });

    if (!certificate) {
      throw new NotFoundException(
        'Certificate not found.',
      );
    }

    return certificate;
  }

  // =====================================================
  // GET CERTIFICATE FOR COURSE
  //
  // GET:
  // /certificates/course/:courseId
  //
  // This is the most useful endpoint for old students.
  // =====================================================

  async getCertificateByCourse(
    courseId: number,
    studentId: number,
  ): Promise<Certificate> {

    return this.getOrCreateCertificate(
      studentId,
      courseId,
    );
  }

  // =====================================================
  // GET ALL CERTIFICATES OF STUDENT
  //
  // GET:
  // /certificates/my
  // =====================================================

  async getMyCertificates(
    studentId: number,
  ): Promise<Certificate[]> {

    return await this.certificateRepository.find({
      where: {
        studentId,
      },

      relations: {
        student: true,
        exam: true,
        attempt: true,
        course: true,
      },

      order: {
        issuedAt: 'DESC',
      },
    });
  }
}

