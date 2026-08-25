import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('pending_users')
export class PendingUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'student' })
  role!: string;

  @Column()
  emailVerificationOtp!: string;

  @Column()
  emailVerificationOtpExpires!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}