import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Exam } from '../exam.entity';
import { Option } from '../option.entity/option.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  questionText!: string;

  @Column({ default: 1 })
  marks!: number;

  @Column({ default: 'single' })
  questionType!: string;

  @ManyToOne(() => Exam, (exam) => exam.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'examId' })
  exam!: Exam;

  @Column()
  examId!: number;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,
  })
  options!: Option[];
}