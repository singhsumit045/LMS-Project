
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exam } from './entities/exam.entity';
import { Question } from './entities/question.entity/question.entity';
import { Option } from './entities/option.entity/option.entity';

import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examsRepository: Repository<Exam>,

    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,

    @InjectRepository(Option)
    private readonly optionsRepository: Repository<Option>,
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
      passingPercentage: createExamDto.passingMarks,
      isPublished: createExamDto.published ?? false,
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
        where: { id },
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

    Object.assign(exam, updateExamDto);

    return await this.examsRepository.save(exam);
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
        where: { id: examId },
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
        where: { id: examId },
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
}

