import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// const bcrypt = require('bcrypt');
// const password = 'securepassword';
// bcrypt.hash(password, 10, (err: any, hash: any) => {
//   if (err) throw err;
//   console.log(hash);
// });
