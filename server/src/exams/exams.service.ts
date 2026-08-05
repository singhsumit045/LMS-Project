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
import {
  ExamAttempt,
} from './entities/exam-attempt.entity/exam-attempt.entity';
import {
  Answer,
} from './entities/answer.entity/answer.entity';

import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

import { SubmitExamDto } from './dto/submit-exam.dto';

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
  ) {}

  // =====================================================
  // CREATE EXAM
  // =====================================================

  async create(
    createExamDto: CreateExamDto,
    teacherId: number,
  ): Promise<Exam> {
    const exam = this.examsRepository.create({
      title: createExamDto.title,
      description: createExamDto.description,
      duration: createExamDto.duration,
      totalMarks: createExamDto.totalMarks,

      courseId: createExamDto.courseId,
      teacherId,

      passingPercentage:
        createExamDto.passingMarks,

      isPublished:
        createExamDto.published ?? false,
    });

    return await this.examsRepository.save(exam);
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
        createdAt: 'DESC',
      },
    });
  }

  // =====================================================
  // GET EXAM BY ID
  // =====================================================

  async findOne(id: number): Promise<Exam> {
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
    const exam = await this.findOne(id);

    // Title
    if (updateExamDto.title !== undefined) {
      exam.title =
        updateExamDto.title;
    }

    // Description
    if (
      updateExamDto.description !== undefined
    ) {
      exam.description =
        updateExamDto.description;
    }

    // Duration
    if (
      updateExamDto.duration !== undefined
    ) {
      exam.duration =
        updateExamDto.duration;
    }

    // Total marks
    if (
      updateExamDto.totalMarks !== undefined
    ) {
      exam.totalMarks =
        updateExamDto.totalMarks;
    }

    // Course
    if (
      updateExamDto.courseId !== undefined
    ) {
      exam.courseId =
        updateExamDto.courseId;
    }

    // Passing percentage
    if (
      updateExamDto.passingMarks !== undefined
    ) {
      exam.passingPercentage =
        updateExamDto.passingMarks;
    }

    // IMPORTANT
    // DTO -> published
    // Entity -> isPublished

    if (
      updateExamDto.published !== undefined
    ) {
      exam.isPublished =
        updateExamDto.published;
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
    const exam = await this.findOne(id);

    await this.examsRepository.remove(exam);

    return {
      message: 'Exam deleted successfully',
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
          id: examId,
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
          id: examId,
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
        id: 'ASC',
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
          id: questionId,
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
          id: questionId,
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
          id: questionId,
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
      message: 'Question deleted successfully',
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
          id: questionId,
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
          id: questionId,
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
        id: 'ASC',
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
          id: optionId,
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
          id: optionId,
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
      message: 'Option deleted successfully',
    };
  }

  // =====================================================
  // START EXAM
  // =====================================================

  async startExam(
    examId: number,
    studentId: number,
  ): Promise<ExamAttempt> {
    const exam =
      await this.examsRepository.findOne({
        where: {
          id: examId,
        },
      });

    if (!exam) {
      throw new NotFoundException(
        `Exam with ID ${examId} not found`,
      );
    }

    // Student can only start published exam
    if (!exam.isPublished) {
      throw new BadRequestException(
        'This exam is not published yet',
      );
    }

    // Check existing unfinished attempt
    const existingAttempt =
      await this.examAttemptsRepository.findOne({
        where: {
          examId,
          studentId,
          submitted: false,
        },
      });

    if (existingAttempt) {
      return existingAttempt;
    }

    // Create new attempt
    const attempt =
      this.examAttemptsRepository.create({
        examId,
        studentId,

        score: 0,
        percentage: 0,

        passed: false,
        submitted: false,
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
  ): Promise<ExamAttempt> {
    // ---------------------------------------------------
    // Find attempt
    // ---------------------------------------------------

    const attempt =
      await this.examAttemptsRepository.findOne({
        where: {
          id: attemptId,
        },

        relations: {
          exam: true,
        },
      });

    if (!attempt) {
      throw new NotFoundException(
        `Exam attempt with ID ${attemptId} not found`,
      );
    }

    // ---------------------------------------------------
    // Already submitted?
    // ---------------------------------------------------

    if (attempt.submitted) {
      throw new BadRequestException(
        'Exam already submitted',
      );
    }

    // ---------------------------------------------------
    // Get ALL questions of this exam
    // ---------------------------------------------------

    const questions =
      await this.questionsRepository.find({
        where: {
          examId: attempt.examId,
        },

        relations: {
          options: true,
        },

        order: {
          id: 'ASC',
        },
      });

    if (questions.length === 0) {
      throw new BadRequestException(
        'This exam has no questions',
      );
    }

    // ---------------------------------------------------
    // Calculate actual total marks
    // ---------------------------------------------------

    let totalMarks = 0;

    for (const question of questions) {
      totalMarks += question.marks;
    }

    // ---------------------------------------------------
    // Student submitted answers
    // ---------------------------------------------------

    let totalScore = 0;

    for (const question of questions) {
      // Find student's answer for this question
      const answerData =
        submitExamDto.answers.find(
          (answer) =>
            answer.questionId ===
            question.id,
        );

      // If student did not answer
      if (!answerData) {
        continue;
      }

      // Find selected option
      const selectedOption =
        question.options.find(
          (option) =>
            option.id ===
            answerData.selectedOptionId,
        );

      const isCorrect =
        selectedOption?.isCorrect === true;

      const marksObtained =
        isCorrect
          ? question.marks
          : 0;

      // Add score
      if (isCorrect) {
        totalScore += question.marks;
      }

      // -------------------------------------------------
      // Save Answer
      // -------------------------------------------------

      const answer =
        this.answersRepository.create({
          attemptId: attempt.id,

          questionId: question.id,

          selectedOptionId:
            selectedOption?.id ?? null,

          isCorrect,

          marksObtained,
        });

      await this.answersRepository.save(
        answer,
      );
    }

    // ---------------------------------------------------
    // Calculate percentage
    // ---------------------------------------------------

    const percentage =
      totalMarks > 0
        ? (totalScore / totalMarks) * 100
        : 0;

    // ---------------------------------------------------
    // Update attempt
    // ---------------------------------------------------

    attempt.score = totalScore;

    attempt.percentage =
      Number(percentage.toFixed(2));

    attempt.passed =
      percentage >=
      attempt.exam.passingPercentage;

    attempt.submitted = true;

    // ---------------------------------------------------
    // Save attempt
    // ---------------------------------------------------

    return await this.examAttemptsRepository.save(
      attempt,
    );
  }

  // =====================================================
  // GET EXAM RESULT
  // =====================================================

  async getExamResult(
    attemptId: number,
  ): Promise<ExamAttempt> {
    const attempt =
      await this.examAttemptsRepository.findOne({
        where: {
          id: attemptId,
        },

        relations: {
          exam: true,

          answers: {
            question: true,
            selectedOption: true,
          },
        },
      });

    if (!attempt) {
      throw new NotFoundException(
        `Exam attempt with ID ${attemptId} not found`,
      );
    }

    return attempt;
  }
}