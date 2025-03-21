import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

// Bootstrap file that starts your NestJS application
// Sets up the server to listen on port 3000 (or environment port)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    }),
  );

  // Add security headers
  app.use(helmet());

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
