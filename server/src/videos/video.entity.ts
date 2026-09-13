import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';   

@Entity()
export class Video {    
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column('text')
  videoUrl!: string;

  @Column()
  publicId!: string;

  @Column()
  courseId!: number;

  @Column({
    type: 'double precision',
    nullable: true,
  })
  duration!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}