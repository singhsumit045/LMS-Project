import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
  })
  rating!: number;

@Column({
  type: 'text',
  nullable: true,
})
review!: string | null;

  // Student
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',

  })
  @JoinColumn({
    name: 'studentId',
  })
  student!: User;

  @Column()
  studentId!: number;

  // Course
  @ManyToOne(() => Course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'courseId',
  })
  course!: Course;

  @Column()
  courseId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}