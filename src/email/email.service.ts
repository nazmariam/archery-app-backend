import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASSWORD');

    this.logger.log(
      `Initializing SMTP transporter with host: ${host}, port: ${port}, user: ${user}`,
    );

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // Temporary fix for TLS certificate issues
      },
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP connection failed:', error);
      } else {
        this.logger.log('SMTP server is ready to send emails');
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<SentMessageInfo> {
    try {
      this.logger.log(`Attempting to send email to: ${options.to}`);

      const mailOptions = {
        from: `"${this.configService.get<string>('SMTP_FROM_NAME')}" <${this.configService.get<string>('SMTP_FROM_EMAIL')}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      this.logger.log(`Mail options prepared:`, {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      this.logger.error(`Error details:`, {
        message: error.message,
        code: error.code,
        command: error.command,
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    resetUrl: string,
  ): Promise<void> {
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password. Please click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `;

    const text = `
      Password Reset Request
      
      Hello,
      
      You have requested to reset your password. Please visit the following link to proceed:
      
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      This is an automated email. Please do not reply to this message.
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Welcome to Archery App!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Archery App!</h2>
        <p>Hello ${firstName},</p>
        <p>Thank you for joining our archery community! We're excited to have you on board.</p>
        <p>You can now:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Join competitions</li>
          <li>Track your progress</li>
          <li>Connect with other archers</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Welcome to the archery community!
        </p>
      </div>
    `;

    const text = `
      Welcome to Archery App!
      
      Hello ${firstName},
      
      Thank you for joining our archery community! We're excited to have you on board.
      
      You can now:
      - Complete your profile
      - Join competitions
      - Track your progress
      - Connect with other archers
      
      If you have any questions, feel free to reach out to our support team.
      
      Welcome to the archery community!
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }
}
