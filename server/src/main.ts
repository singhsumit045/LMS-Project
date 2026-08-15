import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = Array.from(
    new Set(
      [
        'http://localhost:5173',
        'https://lms-project-fawn-omega.vercel.app',
        process.env.FRONTEND_URL,
      ].filter(Boolean),
    ),
  );

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = Number(process.env.PORT) || 8080;

  await app.listen(port, '0.0.0.0');

  console.log(`Backend running on port ${port}`);
}

bootstrap();