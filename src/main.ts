import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontendUrl = configService.get<string>('FRONTEND_URL') as string;

  app.enableCors({
    origin: [frontendUrl, 'http://127.0.0.1:5173'],
    credentials: true,
  });

  const port = configService.get<number>('PORT') as number;
  await app.listen(port);
}
bootstrap();
