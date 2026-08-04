import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ExamAttempt } from '../exam-attempt.entity/exam-attempt.entity';
import { Question } from '../question.entity/question.entity';
import { Option } from '../option.entity/option.entity';
@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ExamAttempt, (attempt) => attempt.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt!: ExamAttempt;

  @Column()
  attemptId!: number;

  @ManyToOne(() => Question, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @Column()
  questionId!: number;

  @ManyToOne(() => Option, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'selectedOptionId' })
  selectedOption!: Option;

  @Column({ nullable: true })
  selectedOptionId!: number;

  @Column({ default: false })
  isCorrect!: boolean;

  @Column({ default: 0 })
  marksObtained!: number;
}