
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText!: string;

  @IsInt()
  @Min(1)
  marks!: number;

  @IsOptional()
  @IsString()
  questionType?: string;
}
