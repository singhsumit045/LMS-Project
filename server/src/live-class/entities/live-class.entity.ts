import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('live_classes')
export class LiveClass {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column()
  courseId!: number;

  @Column()
  teacherId!: number;

  @Column({ type: 'datetime' })
  scheduledAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  endedAt!: Date | null;

  @Column({ default: false })
  isLive!: boolean;

  @Column({ default: false })
  isCompleted!: boolean;

  @Column({ default: false })
  isCancelled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}