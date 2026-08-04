import { IsNumber, Min, Max } from 'class-validator';

export class UpdateVideoProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  watchedPercentage!: number;
}