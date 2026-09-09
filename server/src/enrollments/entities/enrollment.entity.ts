import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
@Unique(['user', 'course'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  enrolledAt!: Date;

  @Column({
    default: 0,
  })
  progress!: number;

  @Column({
    default: false,
  })
  completed!: boolean;

  // Student
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
  })
  user!: User;

  // Course
  @ManyToOne(() => Course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'courseId',
  })
  course!: Course;
} 