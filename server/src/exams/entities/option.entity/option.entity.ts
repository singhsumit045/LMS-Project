import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Question } from '../question.entity/question.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  optionText!: string;

  @Column({ default: false })
  isCorrect!: boolean;

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @Column()
  questionId!: number;
}