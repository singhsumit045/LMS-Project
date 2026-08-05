import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { ExamsService } from './exams.service';

// =====================================================
// EXAM DTOs
// =====================================================

import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

// =====================================================
// QUESTION DTOs
// =====================================================

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

// =====================================================
// OPTION DTOs
// =====================================================

import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

// =====================================================
// SUBMIT EXAM DTO
// =====================================================

import { SubmitExamDto } from './dto/submit-exam.dto';

// =====================================================
// AUTH GUARD
// =====================================================

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
  ) {}

  // =====================================================
  // CREATE EXAM
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createExamDto: CreateExamDto,
    @Req() req: Request,
  ) {
    const teacherId = (req.user as any).id;

    return this.examsService.create(
      createExamDto,
      teacherId,
    );
  }

  // =====================================================
  // GET ALL EXAMS
  // =====================================================

  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  // =====================================================
  // GET TEACHER EXAM RESULTS
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('teacher/results')
  getTeacherResults(
    @Req() req: Request,
  ) {
    const teacherId = (req.user as any).id;

    return this.examsService.getExamResultsForTeacher(
      teacherId,
    );
  }

  // =====================================================
  // GET EXAM BY ID
  // =====================================================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.examsService.findOne(id);
  }

  // =====================================================
  // START EXAM
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post(':examId/start')
  startExam(
    @Param(
      'examId',
      ParseIntPipe,
    )
    examId: number,

    @Req() req: Request,
  ) {
    const studentId =
      (req.user as any).id;

    return this.examsService.startExam(
      examId,
      studentId,
    );
  }

  // =====================================================
  // SUBMIT EXAM
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post('attempts/:attemptId/submit')
  submitExam(
    @Param(
      'attemptId',
      ParseIntPipe,
    )
    attemptId: number,

    @Body()
    submitExamDto: SubmitExamDto,
  ) {
    return this.examsService.submitExam(
      attemptId,
      submitExamDto,
    );
  }

  // =====================================================
  // GET EXAM RESULT
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('attempts/:attemptId/result')
  getExamResult(
    @Param(
      'attemptId',
      ParseIntPipe,
    )
    attemptId: number,
  ) {
    return this.examsService.getExamResult(
      attemptId,
    );
  }

  // =====================================================
  // CREATE QUESTION
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post(':examId/questions')
  createQuestion(
    @Param(
      'examId',
      ParseIntPipe,
    )
    examId: number,

    @Body()
    createQuestionDto: CreateQuestionDto,
  ) {
    return this.examsService.createQuestion(
      examId,
      createQuestionDto,
    );
  }

  // =====================================================
  // GET QUESTIONS BY EXAM
  // =====================================================

  @Get(':examId/questions')
  findQuestions(
    @Param(
      'examId',
      ParseIntPipe,
    )
    examId: number,
  ) {
    return this.examsService.findQuestionsByExam(
      examId,
    );
  }

  // =====================================================
  // GET QUESTION BY ID
  // =====================================================

  @Get('questions/:questionId')
  findQuestion(
    @Param(
      'questionId',
      ParseIntPipe,
    )
    questionId: number,
  ) {
    return this.examsService.findQuestion(
      questionId,
    );
  }

  // =====================================================
  // UPDATE QUESTION
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Patch('questions/:questionId')
  updateQuestion(
    @Param(
      'questionId',
      ParseIntPipe,
    )
    questionId: number,

    @Body()
    updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.examsService.updateQuestion(
      questionId,
      updateQuestionDto,
    );
  }

  // =====================================================
  // DELETE QUESTION
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Delete('questions/:questionId')
  removeQuestion(
    @Param(
      'questionId',
      ParseIntPipe,
    )
    questionId: number,
  ) {
    return this.examsService.removeQuestion(
      questionId,
    );
  }

  // =====================================================
  // CREATE OPTION
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post('questions/:questionId/options')
  createOption(
    @Param(
      'questionId',
      ParseIntPipe,
    )
    questionId: number,

    @Body()
    createOptionDto: CreateOptionDto,
  ) {
    return this.examsService.createOption(
      questionId,
      createOptionDto,
    );
  }

  // =====================================================
  // GET OPTIONS BY QUESTION
  // =====================================================

  @Get('questions/:questionId/options')
  findOptions(
    @Param(
      'questionId',
      ParseIntPipe,
    )
    questionId: number,
  ) {
    return this.examsService.findOptionsByQuestion(
      questionId,
    );
  }

  // =====================================================
  // UPDATE OPTION
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Patch('options/:optionId')
  updateOption(
    @Param(
      'optionId',
      ParseIntPipe,
    )
    optionId: number,

    @Body()
    updateOptionDto: UpdateOptionDto,
  ) {
    return this.examsService.updateOption(
      optionId,
      updateOptionDto,
    );
  }

  // =====================================================
  // DELETE OPTION
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Delete('options/:optionId')
  removeOption(
    @Param(
      'optionId',
      ParseIntPipe,
    )
    optionId: number,
  ) {
    return this.examsService.removeOption(
      optionId,
    );
  }

  // =====================================================
  // UPDATE EXAM
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    updateExamDto: UpdateExamDto,
  ) {
    return this.examsService.update(
      id,
      updateExamDto,
    );
  }

  // =====================================================
  // DELETE EXAM
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.examsService.remove(id);
  }
}