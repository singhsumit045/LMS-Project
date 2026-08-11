import { IsString, MinLength } from 'class-validator';

export class AiChatDto {
  @IsString()
  @MinLength(1)
  message!: string;
}