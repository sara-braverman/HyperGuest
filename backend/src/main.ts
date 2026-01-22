import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
