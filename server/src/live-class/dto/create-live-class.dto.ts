import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateLiveClassDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  courseId!: number;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @Matches(/^https:\/\/(?:[a-z0-9-]+\.)*(?:zoom\.us|zoom\.com|zoomgov\.com)(?:\/|$)/i)
  @MaxLength(2048)
  zoomMeetingUrl?: string;
}