
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { ExamAttempt } from '../../exams/entities/exam-attempt.entity/exam-attempt.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
@Unique(['studentId', 'courseId'])
export class Certificate {
  @PrimaryGeneratedColumn()
  id!: number;

  // =====================================================
  // CERTIFICATE NUMBER
  // =====================================================

  @Column({ unique: true })
  certificateNumber!: string;

  // =====================================================
  // STUDENT
  // =====================================================

  @Column()
  studentId!: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student!: User;

  // =====================================================
  // EXAM
  // =====================================================

  @Column()
  examId!: number;

  @ManyToOne(() => Exam, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'examId' })
  exam!: Exam;

  // =====================================================
  // EXAM ATTEMPT
  // =====================================================

  @Column()
  attemptId!: number;

  @ManyToOne(() => ExamAttempt, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt!: ExamAttempt;

  // =====================================================
  // COURSE
  // =====================================================

  @Column()
  courseId!: number;

  @ManyToOne(() => Course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course!: Course;

  // =====================================================
  // RESULT
  // =====================================================

  @Column({
    type: 'float',
  })
  score!: number;

  @Column({
    type: 'float',
  })
  percentage!: number;

  // =====================================================
  // ISSUE DATE
  // =====================================================

  @CreateDateColumn()
  issuedAt!: Date;
}

