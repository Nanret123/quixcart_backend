import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { accountActivation } from './templates/accountActivation';
import { resetPassword } from './templates/resetPassword';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(
    email: string,
    name: string,
    verificationLink: string,
  ) {
    // Send the verify email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to QuizCart! Please verify your email',
      html: accountActivation(
        name,
        'Quix Cart Ecommerce Store',
        verificationLink,
      ),
    });
  }

  async sendResetPasswordLink(
    email: string,
    name: string,
    resetPasswordLink: string,
  ) {
    // Send the verify email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      html: resetPassword(name, resetPasswordLink),
    });
  }
}
