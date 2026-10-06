import { IsUrl, Matches, MaxLength } from 'class-validator';

export class SetZoomMeetingUrlDto {
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @Matches(/^https:\/\/(?:[a-z0-9-]+\.)*(?:zoom\.us|zoom\.com|zoomgov\.com)(?:\/|$)/i)
  @MaxLength(2048)
  zoomMeetingUrl!: string;
}