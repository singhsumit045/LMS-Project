import {
  IsInt,
  IsIn,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GenerateQuizDto {
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @IsInt()
  @Min(1)
  @Max(20)
  numberOfQuestions!: number;

  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty!: string;
}