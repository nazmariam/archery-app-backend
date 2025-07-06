import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req: ExpressRequest,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    const user = req.user as User;
    return this.userService.update(user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: ExpressRequest,
    @Body() passwordData: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = req.user as User;
    await this.userService.changePassword(user.id, passwordData);
    return { message: 'Password changed successfully' };
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }
}
