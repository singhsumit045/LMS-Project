import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@Body() dto: AiChatDto) {
    return this.aiService.chat(dto.message);
  }
}