import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn()
  id!: number;

  // =========================
  // ANNOUNCEMENT TITLE
  // =========================

  @Column()
  title!: string;

  // =========================
  // ANNOUNCEMENT MESSAGE
  // =========================

  @Column('text')
  message!: string;

  // =========================
  // COURSE
  // =========================

  @ManyToOne(() => Course, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course!: Course;

  @Column()
  courseId!: number;

  // =========================
  // TEACHER
  // =========================

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacherId' })
  teacher!: User;

  @Column()
  teacherId!: number;

  // =========================
  // TIMESTAMP
  // =========================

  @CreateDateColumn()
  createdAt!: Date;
}