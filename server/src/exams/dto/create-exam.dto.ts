import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(1)
  duration!: number;

  @IsInt()
  @Min(0)
  totalMarks!: number;

  @IsInt()
  @Min(0)
  passingMarks!: number;

  @IsInt()
  @Min(1)
  courseId!: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}