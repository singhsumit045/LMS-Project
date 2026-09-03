import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  optionText!: string;

  @IsBoolean()
  isCorrect!: boolean;
}