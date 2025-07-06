import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request as ExpressRequest, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: UserLoginDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setPasswordForOAuthUser(
    @Request() req: ExpressRequest,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<{ message: string }> {
    const user = req.user as any;
    return this.authService.setPasswordForOAuthUser(user.id, setPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Request() req: ExpressRequest,
    @Res() res: Response,
  ) {
    const { jwt } = req.user as any;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    res.redirect(`${frontendUrl}/auth/google/callback?token=${jwt}`);
  }
}
