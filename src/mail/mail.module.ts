import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `${process.env.MAIL_TRANSPORT}`,
      defaults: {
        host: `${process.env.MAIL_HOST}`,
        from: `${process.env.MAIL_USER}`,
        auth: {
          user: `${process.env.MAIL_USER}`,
          pass: `${process.env.MAIL_PASS}`,
        },
        secure: false,
        port: 587,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
