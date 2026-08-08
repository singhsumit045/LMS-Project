import { Rating } from 'src/ratings/entities/rating.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { Notification } from '../../notifications/entities/notification.entity';
@Entity()
export class User {


  @PrimaryGeneratedColumn()
  id!: number;



  // =====================================================
  // BASIC USER DETAILS
  // =====================================================


  @Column()
  name!: string;



  @Column({
    unique: true,
  })
  email!: string;



  @Column()
  password!: string;




  // =====================================================
  // USER ROLE
  // =====================================================


  @Column({
    default: 'student',
  })
  role!: string;




  // =====================================================
  // REFRESH TOKEN
  // =====================================================


  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  refreshToken!: string | null;




  // =====================================================
  // PROFILE IMAGE
  // =====================================================


  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  profileImageUrl!: string | null;



  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profileImagePublicId!: string | null;





  // =====================================================
  // TEACHER SIGNATURE
  // =====================================================


  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  signatureUrl!: string | null;



  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  signaturePublicId!: string | null;





  // =====================================================
  // ONLINE / OFFLINE STATUS
  // =====================================================


  @Column({
    default: false,
  })
  isOnline!: boolean;

  // =====================================================
  // LAST ACTIVE TIME
  // =====================================================

  @Column({
    type: 'datetime',
    nullable: true,
  })
  lastSeen!: Date | null;

  // =====================================================
  // ACCOUNT CREATED DATE
  // =====================================================

  @CreateDateColumn()
  createdAt!: Date;

  // =====================================================
  // RATINGS
  // =====================================================

  @OneToMany(
    () => Rating,
    (rating) => rating.student
  )
  ratings!: Rating[];

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  @OneToMany(
    () => Notification,
    (notification) => notification.user,
  )
  notifications!: Notification[];

 // =====================================================
// PASSWORD RESET
// =====================================================

@Column({
  type: 'varchar',
  length: 255,
  nullable: true,
})
resetPasswordToken!: string | null;

@Column({
  type: 'datetime',
  nullable: true,
})
resetPasswordExpires!: Date | null;

@Column({
  type: 'varchar',
  length: 10,
  nullable: true,
})
resetPasswordOtp!: string | null;

@Column({
  type: 'datetime',
  nullable: true,
})
resetPasswordOtpExpires!: Date | null;

}