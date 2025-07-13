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
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('Google strategy - validate called');
    console.log('Google strategy - profile emails:', profile.emails);
    
    const { emails, name, photos } = profile;

    let user = await this.userService.findByEmail(emails[0].value);
    if (!user) {
      console.log('Google strategy - creating new user');
      user = await this.userService.create({
        authProvider: AuthProviders.Google,
        role: Roles.User,
        email: emails[0].value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        picture: photos[0]?.value,
      });
    } else {
      console.log('Google strategy - existing user found');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const jwt = this.jwtService.sign(payload);
    
    console.log('Google strategy - JWT generated, calling done');

    done(null, { user, jwt });
  }
}
