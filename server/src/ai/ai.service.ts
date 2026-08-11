
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

import { GenerateQuizDto } from './dto/generate-quiz.dto';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured',
      );
    }

    this.ai = new GoogleGenAI({
      apiKey,
    });
  }

  // =====================================================
  // AI CHAT
  // =====================================================

  async chat(message: string): Promise<string> {
    try {
      const response =
        await this.ai.models.generateContent({
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

      return (
        response.text ??
        'Sorry, I could not generate a response.'
      );
    } catch (error) {
      console.error(
        'Gemini API Error:',
        error,
      );

      throw new InternalServerErrorException(
        'AI service is currently unavailable.',
      );
    }
  }

  // =====================================================
  // AI QUIZ GENERATOR
  // =====================================================

  async generateQuiz(
    dto: GenerateQuizDto,
  ): Promise<any> {
    try {
      const response =
        await this.ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',

          contents: [
            {
              role: 'user',

              parts: [
                {
                  text: `
You are an AI quiz generator for an online Learning Management System.

Generate exactly ${dto.numberOfQuestions} multiple-choice questions about:

Topic:
${dto.topic}

Difficulty:
${dto.difficulty}

Requirements:

1. Each question must have exactly 4 options.
2. Exactly ONE option must be correct.
3. Use "single" as questionType.
4. Marks must be 1.
5. Questions must be technically accurate.
6. Questions should match the requested difficulty.
7. Avoid duplicate questions.
8. Return ONLY valid JSON.
9. Do NOT use markdown.
10. Do NOT use \`\`\`json.
11. Do NOT add explanations outside the JSON.

Required JSON format:

{
  "questions": [
    {
      "questionText": "Question here",
      "marks": 1,
      "questionType": "single",
      "options": [
        {
          "optionText": "Option A",
          "isCorrect": false
        },
        {
          "optionText": "Option B",
          "isCorrect": true
        },
        {
          "optionText": "Option C",
          "isCorrect": false
        },
        {
          "optionText": "Option D",
          "isCorrect": false
        }
      ]
    }
  ]
}
`,
                },
              ],
            },
          ],
        });

      const text = response.text ?? '';

      if (!text.trim()) {
        throw new Error(
          'Gemini returned an empty response.',
        );
      }

      // Remove accidental markdown fences
      const cleanText = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      let quiz;

      try {
        quiz = JSON.parse(cleanText);
      } catch (parseError) {
        console.error(
          'Quiz JSON Parse Error:',
          parseError,
        );

        console.error(
          'Gemini Raw Response:',
          text,
        );

        throw new Error(
          'Gemini returned invalid JSON.',
        );
      }

      // Basic validation
      if (
        !quiz ||
        !Array.isArray(quiz.questions)
      ) {
        throw new Error(
          'Invalid quiz structure.',
        );
      }

      if (
        quiz.questions.length !==
        dto.numberOfQuestions
      ) {
        throw new Error(
          'AI generated an incorrect number of questions.',
        );
      }

      return {
        success: true,
        data: quiz,
      };
    } catch (error) {
      console.error(
        'AI Quiz Error:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to generate quiz.',
      );
    }
  }
}

