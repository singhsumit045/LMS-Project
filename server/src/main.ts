import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:5173';

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://lms-project-fawn-omega.vercel.app',
      frontendUrl,
    ],
    credentials: true,
  });

  const port = Number(process.env.PORT) || 8080;

  await app.listen(port, '0.0.0.0');

  console.log(`Backend running on port ${port}`);
}

bootstrap();