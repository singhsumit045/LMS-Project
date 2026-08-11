
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

// =====================================================
// AI EXAM OPTION DTO
// =====================================================

export class SaveAiExamOptionDto {
  @IsString()
  @IsNotEmpty()
  optionText!: string;

  @IsBoolean()
  isCorrect!: boolean;
}

// =====================================================
// AI EXAM QUESTION DTO
// =====================================================

export class SaveAiExamQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  marks?: number;

  @IsOptional()
  @IsString()
  questionType?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveAiExamOptionDto)
  options!: SaveAiExamOptionDto[];
}

// =====================================================
// SAVE AI EXAM DTO
// =====================================================

export class SaveAiExamDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  courseId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  passingPercentage?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveAiExamQuestionDto)
  questions!: SaveAiExamQuestionDto[];
}

