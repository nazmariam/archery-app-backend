import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest): User {
    return req.user as User;
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }
}
