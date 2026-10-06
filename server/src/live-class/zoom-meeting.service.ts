import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface ZoomTokenResponse {
  access_token: string;
}

interface ZoomMeetingResponse {
  id: number;
  join_url: string;
}

@Injectable()
export class ZoomMeetingService {
  private readonly logger = new Logger(ZoomMeetingService.name);

  constructor(private readonly configService: ConfigService) {}

  async createMeeting(
    title: string,
    description: string | null,
    scheduledAt: string,
  ): Promise<{ meetingId: string; joinUrl: string }> {
    const accountId = this.configService.get<string>('ZOOM_ACCOUNT_ID');
    const clientId = this.configService.get<string>('ZOOM_CLIENT_ID');
    const clientSecret = this.configService.get<string>('ZOOM_CLIENT_SECRET');

    if (!accountId || !clientId || !clientSecret) {
      throw new ServiceUnavailableException(
        'Zoom meeting creation is not configured on the server.',
      );
    }

    try {
      const tokenResponse = await axios.post<ZoomTokenResponse>(
        'https://zoom.us/oauth/token',
        new URLSearchParams({
          grant_type: 'account_credentials',
          account_id: accountId,
        }),
        {
          auth: { username: clientId, password: clientSecret },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 15000,
        },
      );

      const meetingResponse = await axios.post<ZoomMeetingResponse>(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: title,
          type: 2,
          start_time: new Date(scheduledAt).toISOString(),
          duration: 60,
          agenda: description || undefined,
          settings: {
            join_before_host: false,
            waiting_room: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );

      if (!meetingResponse.data.id || !meetingResponse.data.join_url) {
        throw new Error('Zoom did not return a meeting ID and join URL.');
      }

      return {
        meetingId: String(meetingResponse.data.id),
        joinUrl: meetingResponse.data.join_url,
      };
    } catch (error) {
      const responseData = axios.isAxiosError(error)
        ? error.response?.data
        : undefined;
      this.logger.error(
        `Zoom meeting creation failed: ${JSON.stringify(responseData || (error instanceof Error ? error.message : 'Unknown error'))}`,
      );
      throw new ServiceUnavailableException(
        'Zoom could not create the meeting. Check the Zoom app credentials and API permissions.',
      );
    }
  }
}