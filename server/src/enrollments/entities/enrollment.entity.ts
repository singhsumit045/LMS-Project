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
    type: 'datetime',
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

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course!: Course;
}