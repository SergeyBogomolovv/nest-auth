import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://geraxfn@gmail.com:rvsm epcq nzcf obmm@smtp.gmail.com',
      defaults: {
        host: 'smtp.gmail.com',
        from: 'geraxfn@gmail.com',
        auth: { user: 'geraxfn@gmail.com', pass: 'rvsm epcq nzcf obmm' },
        secure: false,
        port: 587,
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
