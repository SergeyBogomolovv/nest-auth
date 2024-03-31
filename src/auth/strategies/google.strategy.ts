import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: `${configService.get('SERVER_URL')}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accesToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accesToken,
    };
    const userExists = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!userExists) {
      await this.prisma.user.create({
        data: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.picture,
          emailVerified: new Date(),
        },
      });
    }
    done(null, { user: userExists, accesToken: user.accesToken });
  }
}
