import { IsArray } from 'class-validator';

export class SubmitExamDto {
  @IsArray()
  answers!: {
    questionId: number;
    selectedOptionId: number;
  }[];
}