import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalMarks!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  passingPercentage!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  courseId!: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}