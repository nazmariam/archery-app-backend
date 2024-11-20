import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthProviders, Roles } from '../../user/types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, name, photos } = profile;

    let user = await this.userService.findByEmail(emails[0].value);
    if (!user) {
      user = await this.userService.create({
        authProvider: AuthProviders.Google,
        role: Roles.User,
        email: emails[0].value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        picture: photos[0]?.value,
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const jwt = this.jwtService.sign(payload);

    done(null, { user, jwt });
  }
}
