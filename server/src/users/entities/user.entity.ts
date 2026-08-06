import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';


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


}