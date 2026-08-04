import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['userId', 'videoId'])
export class VideoProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  videoId!: number;

  @Column({
    type: 'float',
    default: 0,
  })
  watchedPercentage!: number;

  @Column({
    default: false,
  })
  completed!: boolean;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  completedAt!: Date | null;
}