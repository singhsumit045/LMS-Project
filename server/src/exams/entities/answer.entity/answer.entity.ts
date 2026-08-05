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

  // Exam Attempt
  @ManyToOne(() => ExamAttempt, (attempt) => attempt.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt!: ExamAttempt;

  @Column()
  attemptId!: number;

  // Question
  @ManyToOne(() => Question, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @Column()
  questionId!: number;

  // Selected Option
  @ManyToOne(() => Option, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'selectedOptionId' })
  selectedOption!: Option | null;

  @Column({ nullable: true })
  selectedOptionId!: number | null;

  // Answer correctness
  @Column({ default: false })
  isCorrect!: boolean;

  // Marks obtained
  @Column({ default: 0 })
  marksObtained!: number;
}