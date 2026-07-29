import { IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  courseId!: number;
}