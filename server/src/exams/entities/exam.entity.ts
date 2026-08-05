import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Question } from './question.entity/question.entity';
import { ExamAttempt } from './exam-attempt.entity/exam-attempt.entity';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ default: 30 })
  duration!: number;

  @Column({ default: 0 })
  totalMarks!: number;

  @Column({ default: 40 })
  passingPercentage!: number;

  @Column({ default: false})
  isPublished!: boolean;

  // Teacher who created the exam
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher!: User;

  @Column()
  teacherId!: number;

  // Course for which exam is created
  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course!: Course;

  @Column()
  courseId!: number;

  // Exam questions
  @OneToMany(() => Question, (question) => question.exam, {
    cascade: true,
  })
  questions!: Question[];

  // Student attempts
  @OneToMany(() => ExamAttempt, (attempt) => attempt.exam)
  attempts!: ExamAttempt[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}