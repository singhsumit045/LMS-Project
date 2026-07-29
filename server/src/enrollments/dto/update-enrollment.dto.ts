import { IsNumber, Min, Max } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  progress!: number;
}