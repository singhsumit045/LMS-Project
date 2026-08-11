import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.ai = new GoogleGenAI({
      apiKey,
    });
  }

  async chat(message: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `
You are an AI study assistant for an online Learning Management System (LMS).

Your responsibilities:
- Explain technical concepts in simple language.
- Give practical examples.
- Help students understand programming concepts.
- Provide clean and beginner-friendly code when required.
- Break difficult topics into smaller steps.
- If the question is unclear, ask the student for clarification.
- Do not unnecessarily make answers very long.

Student question:
${message}
                `,
              },
            ],
          },
        ],
      });

      return response.text ?? 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Gemini API Error:', error);

      throw new InternalServerErrorException(
        'AI service is currently unavailable.',
      );
    }
  }
}