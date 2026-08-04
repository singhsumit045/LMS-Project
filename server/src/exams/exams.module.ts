import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

import { Exam } from './entities/exam.entity';
import { Question } from './entities/question.entity/question.entity';
import { Option } from './entities/option.entity/option.entity';
import { ExamAttempt } from './entities/exam-attempt.entity/exam-attempt.entity';
import { Answer } from './entities/answer.entity/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exam,
      Question,
      Option,
      ExamAttempt,
      Answer,
    ]),
  ],

  controllers: [ExamsController],

  providers: [ExamsService],

  exports: [ExamsService],
})
export class ExamsModule {}