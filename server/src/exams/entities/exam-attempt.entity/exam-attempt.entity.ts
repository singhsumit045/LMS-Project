import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';


import { Exam } from '../exam.entity';
import { Answer } from '../answer.entity/answer.entity';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class ExamAttempt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  score!: number;

  @Column({ default: 0 })
  percentage!: number;

  @Column({ default: false })
  passed!: boolean;

  @Column({ default: false })
  submitted!: boolean;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student!: User;

  @Column()
  studentId!: number;

  @ManyToOne(() => Exam, (exam) => exam.attempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'examId' })
  exam!: Exam;

  @Column()
  examId!: number;

  @OneToMany(() => Answer, (answer) => answer.attempt, {
    cascade: true,
  })
  answers!: Answer[];

  @CreateDateColumn()
  createdAt!: Date;
}