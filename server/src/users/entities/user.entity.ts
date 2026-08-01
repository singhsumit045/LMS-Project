import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
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

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  profileImageUrl!: string | null;

  // =========================
  // ONLINE / OFFLINE STATUS
  // =========================

  @Column({ default: false })
  isOnline!: boolean;

  // =========================
  // LAST ACTIVE TIME
  // =========================

  @Column({ type: 'datetime', nullable: true })
  lastSeen!: Date | null;
}