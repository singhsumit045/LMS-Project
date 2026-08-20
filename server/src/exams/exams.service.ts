
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exam } from './entities/exam.entity';
import { Question } from './entities/question.entity/question.entity';
import { Option } from './entities/option.entity/option.entity';

import { ExamAttempt } from './entities/exam-attempt.entity/exam-attempt.entity';
import { Answer } from './entities/answer.entity/answer.entity';

import { Certificate } from '../certificates/entities/certificate.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

import { SubmitExamDto } from './dto/submit-exam.dto';

import { SaveAiExamDto } from './dto/save-ai-exam.dto';

import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examsRepository: Repository<Exam>,

    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,

    @InjectRepository(Option)
    private readonly optionsRepository: Repository<Option>,

    @InjectRepository(ExamAttempt)
    private readonly examAttemptsRepository: Repository<ExamAttempt>,

    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,

    @InjectRepository(Certificate)
    private readonly certificatesRepository: Repository<Certificate>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    private readonly notificationsService: NotificationsService,
  ) {}

  // =====================================================
  // SAVE AI GENERATED EXAM
  // =====================================================

  async saveAiExam(
    dto: SaveAiExamDto,
    teacherId: number,
  ) {
    if (!dto.title) {
      throw new BadRequestException(
        'Exam title is required.',
      );
    }

    if (!dto.courseId) {
      throw new BadRequestException(
        'Course ID is required.',
      );
    }

    if (
      !dto.questions ||
      !Array.isArray(dto.questions) ||
      dto.questions.length === 0
    ) {
      throw new BadRequestException(
        'At least one question is required.',
      );
    }

    // -----------------------------------------------------
    // CREATE EXAM
    // -----------------------------------------------------

    const exam = this.examsRepository.create({
      title: dto.title,

      description:
        dto.description || '',

      duration:
        dto.duration || 30,

      totalMarks: 0,

      passingPercentage:
        dto.passingPercentage || 40,

      isPublished:
        dto.isPublished ?? false,

      teacherId,

      courseId: dto.courseId,
    });

    const savedExam =
      await this.examsRepository.save(exam);

    // -----------------------------------------------------
    // CREATE QUESTIONS + OPTIONS
    // -----------------------------------------------------

    let totalMarks = 0;

    for (const questionDto of dto.questions) {
      const marks =
        Number(questionDto.marks) || 1;

      totalMarks += marks;

      const question =
        this.questionsRepository.create({
          questionText:
            questionDto.questionText,

          marks,

          questionType:
            questionDto.questionType ||
            'single',

          examId:
            savedExam.id,
        });

      const savedQuestion =
        await this.questionsRepository.save(
          question,
        );

      // ---------------------------------------------------
      // CREATE OPTIONS
      // ---------------------------------------------------

      if (
        Array.isArray(
          questionDto.options,
        )
      ) {
        const options =
          questionDto.options.map(
            (option) =>
              this.optionsRepository.create({
                optionText:
                  option.optionText,

                isCorrect:
                  option.isCorrect ?? false,

                questionId:
                  savedQuestion.id,
              }),
          );

        if (options.length > 0) {
          await this.optionsRepository.save(
            options,
          );
        }
      }
    }

    // -----------------------------------------------------
    // UPDATE TOTAL MARKS
    // -----------------------------------------------------

    savedExam.totalMarks =
      totalMarks;

    await this.examsRepository.save(
      savedExam,
    );

    // -----------------------------------------------------
    // NOTIFICATION IF PUBLISHED
    // -----------------------------------------------------

    if (savedExam.isPublished) {
      const enrollments =
        await this.enrollmentRepository.find({
          where: {
            course: {
              id: savedExam.courseId,
            },
          },

          relations: {
            user: true,
          },
        });

      for (
        const enrollment of enrollments
      ) {
        if (enrollment.user) {
          await this.notificationsService.createNotification(
            enrollment.user.id,
            'New Exam Available 📝',
            `${savedExam.title} has been published for your course.`,
            NotificationType.EXAM,
          );
        }
      }
    }

    return {
      success: true,

      message:
        'AI generated exam saved successfully.',

      examId:
        savedExam.id,

      exam:
        savedExam,
    };
  }

  // =====================================================
  // ENSURE CERTIFICATE
  // =====================================================

  private async ensureCertificateForAttempt(
    attempt: ExamAttempt,
  ): Promise<Certificate | null> {
    if (!attempt.passed) {
      return null;
    }

    // ---------------------------------------------------
    // EXISTING CERTIFICATE
    // ---------------------------------------------------

    const existingCertificate =
      await this.certificatesRepository.findOne({
        where: {
          studentId:
            attempt.studentId,

          attemptId:
            attempt.id,
        },

        relations: {
          student: true,
          exam: true,
          course: true,
        },
      });

    if (existingCertificate) {
      return existingCertificate;
    }

    // ---------------------------------------------------
    // EXAM
    // ---------------------------------------------------

    if (!attempt.exam) {
      const exam =
        await this.examsRepository.findOne({
          where: {
            id: attempt.examId,
          },
        });

      if (!exam) {
        throw new NotFoundException(
          `Exam with ID ${attempt.examId} not found`,
        );
      }

      attempt.exam = exam;
    }

    // ---------------------------------------------------
    // CERTIFICATE NUMBER
    // ---------------------------------------------------

    const certificateNumber =
      `LH-CERT-${Date.now()}-${attempt.id}`;

    // ---------------------------------------------------
    // CREATE CERTIFICATE
    // ---------------------------------------------------

    const certificate =
      this.certificatesRepository.create({
        certificateNumber,

        studentId:
          attempt.studentId,

        examId:
          attempt.examId,

        attemptId:
          attempt.id,

        courseId:
          attempt.exam.courseId,

        score:
          Number(attempt.score || 0),

        percentage:
          Number(
            attempt.percentage || 0,
          ),
      });

    const savedCertificate =
      await this.certificatesRepository.save(
        certificate,
      );

    console.log(
      'Certificate created:',
      savedCertificate.certificateNumber,
    );

    return await this.certificatesRepository.findOne({
      where: {
        id:
          savedCertificate.id,
      },

      relations: {
        student: true,
        exam: true,
        course: true,
      },
    });
  }

  // =====================================================
  // CREATE EXAM
  // =====================================================

  async create(
    createExamDto: CreateExamDto,
    teacherId: number,
  ): Promise<Exam> {
    const exam =
      this.examsRepository.create({
        title:
          createExamDto.title,

        description:
          createExamDto.description,

        duration:
          createExamDto.duration,

        totalMarks:
          createExamDto.totalMarks,

        courseId:
          createExamDto.courseId,

        teacherId,

        passingPercentage:
          createExamDto.passingPercentage,

        isPublished:
          createExamDto.isPublished ??
          false,
      });

    console.log(
      'Creating Exam:',
      {
        title:
          exam.title,

        courseId:
          exam.courseId,

        teacherId:
          exam.teacherId,

        isPublished:
          exam.isPublished,
      },
    );

    const savedExam =
      await this.examsRepository.save(
        exam,
      );

    // ---------------------------------------------------
    // NOTIFICATION
    // ---------------------------------------------------

    if (savedExam.isPublished) {
      const enrollments =
        await this.enrollmentRepository.find({
          where: {
            course: {
              id:
                savedExam.courseId,
            },
          },

          relations: {
            user: true,
          },
        });

      for (
        const enrollment of enrollments
      ) {
        if (enrollment.user) {
          await this.notificationsService.createNotification(
            enrollment.user.id,
            'New Exam Available 📝',
            `${savedExam.title} has been published for your course.`,
            NotificationType.EXAM,
          );
        }
      }
    }

    return savedExam;
  }

  // =====================================================
  // GET ALL EXAMS
  // =====================================================

  async findAll(): Promise<Exam[]> {
    return await this.examsRepository.find({
      relations: {
        questions: {
          options: true,
        },
      },

      order: {
        createdAt:
          'DESC',
      },
    });
  }

  // =====================================================
  // GET TEACHER EXAMS
  // =====================================================

  async getTeacherExams(
    teacherId: number,
  ): Promise<Exam[]> {
    return await this.examsRepository.find({
      where: {
        teacherId,
      },

      relations: {
        questions: {
          options: true,
        },

        course: true,
      },

      order: {
        createdAt:
          'DESC',
      },
    });
  }

  // =====================================================
  // GET EXAM BY ID
  // =====================================================

  async findOne(
    id: number,
  ): Promise<Exam> {
    const exam =
      await this.examsRepository.findOne({
        where: {
          id,
        },

        relations: {
          questions: {
            options: true,
          },
        },
      });

    if (!exam) {
      throw new NotFoundException(
        `Exam with ID ${id} not found`,
      );
    }

    return exam;
  }

  // =====================================================
  // UPDATE EXAM
  // =====================================================

  async update(
    id: number,
    updateExamDto: UpdateExamDto,
  ): Promise<Exam> {
    const exam =
      await this.findOne(id);

    if (
      updateExamDto.title !==
      undefined
    ) {
      exam.title =
        updateExamDto.title;
    }

    if (
      updateExamDto.description !==
      undefined
    ) {
      exam.description =
        updateExamDto.description;
    }

    if (
      updateExamDto.duration !==
      undefined
    ) {
      exam.duration =
        updateExamDto.duration;
    }

    if (
      updateExamDto.totalMarks !==
      undefined
    ) {
      exam.totalMarks =
        updateExamDto.totalMarks;
    }

    if (
      updateExamDto.courseId !==
      undefined
    ) {
      exam.courseId =
        updateExamDto.courseId;
    }

    if (
      updateExamDto.passingPercentage !==
      undefined
    ) {
      exam.passingPercentage =
        updateExamDto.passingPercentage;
    }

    if (
      updateExamDto.isPublished !==
      undefined
    ) {
      const wasPublished =
        exam.isPublished;

      exam.isPublished =
        updateExamDto.isPublished;
      // -------------------------------------------------
      // NOTIFY WHEN NEWLY PUBLISHED
      // -------------------------------------------------

      if (        
        !wasPublished &&
        exam.isPublished
      ) {
        const enrollments =
          await this.enrollmentRepository.find({
            where: {
              course: {
                id:
                  exam.courseId,
              },
            },

            relations: {
              user: true,
            },
          });

        for (
          const enrollment of enrollments
        ) {
          if (enrollment.user) {
            await this.notificationsService.createNotification(
              enrollment.user.id,
              'New Exam Available 📝',
              `${exam.title} has been published for your course.`,
              NotificationType.EXAM,
            );
          }
        }
      }
    }

    return await this.examsRepository.save(
      exam,
    );
  }

  // =====================================================
  // DELETE EXAM
  // =====================================================

  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const exam =
      await this.findOne(id);

    await this.examsRepository.remove(
      exam,
    );

    return {
      message:
        'Exam deleted successfully',
    };
  }

  // =====================================================
  // CREATE QUESTION
  // =====================================================

  async createQuestion(
    examId: number,
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const exam =
      await this.examsRepository.findOne({
        where: {
          id:
            examId,
        },
      });

    if (!exam) {
      throw new NotFoundException(
        `Exam with ID ${examId} not found`,
      );
    }

    const question =
      this.questionsRepository.create({
        questionText:
          createQuestionDto.questionText,

        marks:
          createQuestionDto.marks,

        questionType:
          createQuestionDto.questionType ??
          'single',

        examId,
      });

    return await this.questionsRepository.save(
      question,
    );
  }

  // =====================================================
  // GET QUESTIONS BY EXAM
  // =====================================================

  async findQuestionsByExam(
    examId: number,
  ): Promise<Question[]> {
    const exam =
      await this.examsRepository.findOne({
        where: {
          id:
            examId,
        },
      });

    if (!exam) {
      throw new NotFoundException(
        `Exam with ID ${examId} not found`,
      );
    }

    return await this.questionsRepository.find({
      where: {
        examId,
      },

      relations: {
        options: true,
      },

      order: {
        id:
          'ASC',
      },
    });
  }

  // =====================================================
  // GET QUESTION BY ID
  // =====================================================

  async findQuestion(
    questionId: number,
  ): Promise<Question> {
    const question =
      await this.questionsRepository.findOne({
        where: {
          id:
            questionId,
        },

        relations: {
          options: true,
        },
      });

    if (!question) {
      throw new NotFoundException(
        `Question with ID ${questionId} not found`,
      );
    }

    return question;
  }

  // =====================================================
  // UPDATE QUESTION
  // =====================================================

  async updateQuestion(
    questionId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const question =
      await this.questionsRepository.findOne({
        where: {
          id:
            questionId,
        },
      });

    if (!question) {
      throw new NotFoundException(
        `Question with ID ${questionId} not found`,
      );
    }

    Object.assign(
      question,
      updateQuestionDto,
    );

    return await this.questionsRepository.save(
      question,
    );
  }

  // =====================================================
  // DELETE QUESTION
  // =====================================================
   
  async removeQuestion(
    questionId: number,
  ): Promise<{ message: string }> {
    const question =
      await this.questionsRepository.findOne({
        where: {
          id:
            questionId,
        },
      });

    if (!question) {
      throw new NotFoundException(
        `Question with ID ${questionId} not found`,
      );
    }

    await this.questionsRepository.remove(
      question,
    );

    return {
      message:
        'Question deleted successfully',
    };
  }

  // =====================================================
  // CREATE OPTION
  // =====================================================

  async createOption(
    questionId: number,
    createOptionDto: CreateOptionDto,
  ): Promise<Option> {
    const question =
      await this.questionsRepository.findOne({
        where: {
          id:
            questionId,
        },
      });

    if (!question) {
      throw new NotFoundException(
        `Question with ID ${questionId} not found`,
      );
    }

    const option =
      this.optionsRepository.create({
        optionText:
          createOptionDto.optionText,

        isCorrect:
          createOptionDto.isCorrect,

        questionId,
      });

    return await this.optionsRepository.save(
      option,
    );
  }

  // =====================================================
  // GET OPTIONS BY QUESTION
  // =====================================================

  async findOptionsByQuestion(
    questionId: number,
  ): Promise<Option[]> {
    const question =
      await this.questionsRepository.findOne({
        where: {
          id:
            questionId,
        },
      });

    if (!question) {
      throw new NotFoundException(
        `Question with ID ${questionId} not found`,
      );
    }

    return await this.optionsRepository.find({
      where: {
        questionId,
      },

      order: {
        id:
          'ASC',
      },
    });
  }

  // =====================================================
  // UPDATE OPTION
  // =====================================================

  async updateOption(
    optionId: number,
    updateOptionDto: UpdateOptionDto,
  ): Promise<Option> {
    const option =
      await this.optionsRepository.findOne({
        where: {
          id:
            optionId,
        },
      });

    if (!option) {
      throw new NotFoundException(
        `Option with ID ${optionId} not found`,
      );
    }

    Object.assign(
      option,
      updateOptionDto,
    );

    return await this.optionsRepository.save(
      option,
    );
  }

  // =====================================================
  // DELETE OPTION
  // =====================================================

  async removeOption(
    optionId: number,
  ): Promise<{ message: string }> {
    const option =
      await this.optionsRepository.findOne({
        where: {
          id:
            optionId,
        },
      });

    if (!option) {
      throw new NotFoundException(
        `Option with ID ${optionId} not found`,
      );
    }

    await this.optionsRepository.remove(
      option,
    );

    return {
      message:
        'Option deleted successfully',
    };
  }

  // =====================================================
  // START EXAM
  // MAX 3 ATTEMPTS PER STUDENT PER EXAM
  // =====================================================

  async startExam(
    examId: number,
    studentId: number,
  ) {
    const exam =
      await this.examsRepository.findOne({
        where: {
          id:
            examId,
        },
      });

    if (!exam) {
      throw new NotFoundException(
        `Exam with ID ${examId} not found`,
      );
    }

    // ---------------------------------------------------
    // CHECK PUBLISHED
    // ---------------------------------------------------

    if (!exam.isPublished) {
      throw new BadRequestException(
        'This exam is not published yet',
      );
    }

    // ---------------------------------------------------
    // CHECK EXISTING UNFINISHED ATTEMPT
    // ---------------------------------------------------
    // Agar student ne exam start kiya hai lekin
    // submit nahi kiya hai, wahi attempt continue hoga.

    const existingAttempt =
      await this.examAttemptsRepository.findOne({
        where: {
          examId,
          studentId,
          submitted:
            false,
        },

        order: {
          createdAt:
            'DESC',
        },
      });

    if (existingAttempt) {
      return existingAttempt;
    }

    // ---------------------------------------------------
    // COUNT SUBMITTED ATTEMPTS
    // ---------------------------------------------------

    const submittedAttempts =
      await this.examAttemptsRepository.count({
        where: {
          examId,
          studentId,
          submitted:
            true,
        },
      });

    // ---------------------------------------------------
    // MAXIMUM 3 ATTEMPTS
    // ---------------------------------------------------

    const MAX_ATTEMPTS = 3;

    if (
      submittedAttempts >=
      MAX_ATTEMPTS
    ) {
      throw new BadRequestException(
        `You have reached the maximum limit of ${MAX_ATTEMPTS} attempts for this exam.`,
      );
    }

    // ---------------------------------------------------
    // CREATE NEW ATTEMPT
    // ---------------------------------------------------

    const attempt =
      this.examAttemptsRepository.create({
        examId,

        studentId,

        score:
          0,

        percentage:
          0,

        passed:
          false,

        submitted:
          false,
      });

    return await this.examAttemptsRepository.save(
      attempt,
    );
  }

  // =====================================================
  // SUBMIT EXAM
  // =====================================================

  async submitExam(
    attemptId: number,
    submitExamDto: SubmitExamDto,
  ) {
    const attempt =
      await this.examAttemptsRepository.findOne({
        where: {
          id:
            attemptId,
        },

        relations: {
          exam:
            true,
        },
      });

    if (!attempt) {
      throw new NotFoundException(
        `Exam attempt with ID ${attemptId} not found`,
      );
    }

    // ---------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // ---------------------------------------------------

    if (attempt.submitted) {
      throw new BadRequestException(
        'Exam already submitted',
      );
    }

    // ---------------------------------------------------
    // GET QUESTIONS
    // ---------------------------------------------------

    const questions =
      await this.questionsRepository.find({
        where: {
          examId:
            attempt.examId,
        },

        relations: {
          options:
            true,
        },

        order: {
          id:
            'ASC',
        },
      });

    if (questions.length === 0) {
      throw new BadRequestException(
        'This exam has no questions',
      );
    }

    let totalMarks = 0;

    let totalScore = 0;

    // ---------------------------------------------------
    // CHECK ANSWERS
    // ---------------------------------------------------

    for (
      const question of questions
    ) {
      totalMarks += Number(
        question.marks || 0,
      );

      const answerData =
        submitExamDto.answers.find(
          (answer) =>
            answer.questionId ===
            question.id,
        );

      if (!answerData) {
        continue;
      }

      const selectedOption =
        question.options.find(
          (option) =>
            option.id ===
            answerData.selectedOptionId,
        );

      const isCorrect =
        selectedOption?.isCorrect ===
        true;

      const marksObtained =
        isCorrect
          ? Number(
              question.marks,
            )
          : 0;

      if (isCorrect) {
        totalScore += Number(
          question.marks,
        );
      }

      const answer =
        this.answersRepository.create({
          attemptId:
            attempt.id,

          questionId:
            question.id,

          selectedOptionId:
            selectedOption?.id ??
            null,     

          isCorrect,

          marksObtained,
        });

      await this.answersRepository.save(
        answer,
      );
    }

    // ---------------------------------------------------
    // CALCULATE RESULT
    // ---------------------------------------------------

    const percentage =
      totalMarks > 0
        ? (totalScore /
            totalMarks) *
          100
        : 0;

    attempt.score =
      totalScore;

    attempt.percentage =
      Number(
        percentage.toFixed(2),
      );

    attempt.passed =
      percentage >=
      Number(
        attempt.exam
          .passingPercentage,
      );

    attempt.submitted =
      true;

    const savedAttempt =
      await this.examAttemptsRepository.save(
        attempt,
      );

    // ---------------------------------------------------
    // CREATE CERTIFICATE IF PASSED
    // ---------------------------------------------------

    if (
      savedAttempt.passed
    ) {
      await this.ensureCertificateForAttempt(
        savedAttempt,
      );
    }

    return savedAttempt;
  }

  // =====================================================
  // GET EXAM RESULT
  // =====================================================

  async getExamResult(
    attemptId: number,
  ) {
    const attempt =
      await this.examAttemptsRepository.findOne({
        where: {
          id:
            attemptId,
        },

        relations: {
          exam:
            true,

          answers: {
            question:
              true,

            selectedOption:
              true,
          },
        },
      });

    if (!attempt) {
      throw new NotFoundException(
        `Exam attempt with ID ${attemptId} not found`,
      );
    }

    const certificate =
      await this.ensureCertificateForAttempt(
        attempt,
      );

    const questions =
      await this.questionsRepository.find({
        where: {
          examId:
            attempt.examId,
        },

        relations: {
          options:
            true,
        },

        order: {
          id:
            'ASC',
        },
      }); 

    const totalQuestions =
      questions.length;

    const attemptedQuestions =
      attempt.answers?.length ??
      0;

    const correctAnswers =
      attempt.answers?.filter(
        (answer) =>
          answer.isCorrect ===
          true,
      ).length ??
      0;

    const wrongAnswers =
      attempt.answers?.filter(
        (answer) =>
          answer.isCorrect ===
          false,
      ).length ??
      0;

    const totalMarks =
      questions.reduce(
        (total, question) =>
          total +
          Number(
            question.marks ||
              0,
          ),
        0,
      );

    const obtainedMarks =
      Number(
        attempt.score ||
          0,
      );

    const percentage =
      totalMarks > 0
        ? Number(
            (
              (obtainedMarks /
                totalMarks) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      id:
        attempt.id,

      attemptId:
        attempt.id,

      examId:
        attempt.examId,

      studentId:
        attempt.studentId,

      exam:
        attempt.exam,

      certificateId:
        certificate?.id ??
        null,

      certificateNumber:
        certificate?.certificateNumber ??
        null,

      certificate:
        certificate
          ? {
              id:
                certificate.id,

              certificateNumber:
                certificate.certificateNumber,

              score:
                certificate.score,

              percentage:
                certificate.percentage,

              issuedAt:
                certificate.issuedAt,
            }
          : null,

      totalQuestions,

      attemptedQuestions,

      correctAnswers,

      wrongAnswers,

      totalMarks,

      obtainedMarks,

      score:
        obtainedMarks,

      percentage,

      passingPercentage:
        attempt.exam
          ?.passingPercentage ??
        40,

      passed:
        attempt.passed,

      submitted:
        attempt.submitted,

      createdAt:
        attempt.createdAt,

      answers:
        attempt.answers,
    };
  }

  // =====================================================
  // GET LAST SUBMITTED RESULT
  // =====================================================

  async getLastResult(
    examId: number,
    studentId: number,
  ) {
    const attempt =
      await this.examAttemptsRepository.findOne({
        where: {
          examId,

          studentId,

          submitted:
            true,
        },

        relations: {
          exam:
            true,

          answers: {
            question:
              true,

            selectedOption:
              true,
          },
        },

        order: {
          createdAt:
            'DESC',
        },
      });

    if (!attempt) {
      throw new NotFoundException(
        'No submitted exam result found.',
      );
    }

    const certificate =
      await this.ensureCertificateForAttempt(
        attempt,
      );

    const questions =
      await this.questionsRepository.find({
        where: {
          examId,
        },

        relations: {
          options:
            true,
        },

        order: {
          id:
            'ASC',
        },
      });

    const totalQuestions =
      questions.length;

    const attemptedQuestions =
      attempt.answers?.length ??
      0;

    const correctAnswers =
      attempt.answers?.filter(
        (answer) =>
          answer.isCorrect ===
          true,
      ).length ??
      0;

    const wrongAnswers =
      attempt.answers?.filter(
        (answer) =>
          answer.isCorrect ===
          false,
      ).length ??
      0;

    const totalMarks =
      questions.reduce(
        (total, question) =>
          total +
          Number(
            question.marks ||
              0,
          ),
        0,
      );

    const obtainedMarks =
      Number(
        attempt.score ||
          0,
      );

    const percentage =
      totalMarks > 0
        ? Number(
            (
              (obtainedMarks /
                totalMarks) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      id:
        attempt.id,

      attemptId:
        attempt.id,

      examId:
        attempt.examId,

      studentId:
        attempt.studentId,

      exam:
        attempt.exam,

      certificateId:
        certificate?.id ??
        null,

      certificateNumber:
        certificate?.certificateNumber ??
        null,

      certificate:
        certificate
          ? {
              id:
                certificate.id,

              certificateNumber:
                certificate.certificateNumber,

              score:
                certificate.score,

              percentage:
                certificate.percentage,

              issuedAt:
                certificate.issuedAt,
            }
          : null,

      totalQuestions,

      attemptedQuestions,

      correctAnswers,

      wrongAnswers,

      totalMarks,

      obtainedMarks,

      score:
        obtainedMarks,

      percentage,

      passingPercentage:
        attempt.exam
          ?.passingPercentage ??
        40,

      passed:
        attempt.passed,

      submitted:
        attempt.submitted,

      createdAt:
        attempt.createdAt,

      answers:
        attempt.answers,
    };
  }

  // =====================================================
  // GET ALL EXAM RESULTS FOR TEACHER
  // =====================================================

  async getExamResultsForTeacher(
    teacherId: number,
  ): Promise<ExamAttempt[]> {
    return await this.examAttemptsRepository.find({
      where: {
        exam: {
          teacherId,
        },

        submitted:
          true,
      },

      relations: {
        student:
          true,

        exam:
          true,
      },

      order: {
        createdAt:
          'DESC',
      },
    });
  }
}

