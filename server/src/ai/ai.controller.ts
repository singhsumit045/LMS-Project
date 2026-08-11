import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateQuizDto } from './dto/generate-quiz.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@Body() dto: AiChatDto) {
    return this.aiService.chat(dto.message);
  }

  @Post('generate-quiz')
@UseGuards(JwtAuthGuard)
async generateQuiz(
  @Body() dto: GenerateQuizDto,
) {
  return this.aiService.generateQuiz(dto);
}
}