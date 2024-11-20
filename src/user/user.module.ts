import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
