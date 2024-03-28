import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ActivationMailDto } from './dto/activation-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendActivationMail(dto: ActivationMailDto) {
    this.mailerService.sendMail({
      to: dto.to,
      subject: `Активация пользователя`,
      text: '',
      html: `
        <div>
          <h1>Для активации аккаунта перейдите по ссылке</h1>
          <a href=${dto.link}>Ссылка</a>
        </div>
    `,
    });
  }
}
