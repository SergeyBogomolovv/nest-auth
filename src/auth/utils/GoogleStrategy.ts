import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID:
        '83200993121-tjrbk0b775f18p60u0csjgq6o4nh77tl.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5174/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateUser({
      email: profile.emails[0].value,
      name: profile.displayName,
      image: profile.photos[0].value,
    });
    return user;
  }
}
