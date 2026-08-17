import { IsIn } from 'class-validator';

export class UpdateRoleDto {
  @IsIn(['student', 'teacher', 'admin'], {
    message: 'role must be student, teacher or admin',
  })
  role!: string;
}