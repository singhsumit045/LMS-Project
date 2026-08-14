import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const options = {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      family: 4,
      connectionTimeout: 10000,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    } as SMTPTransport.Options;

    this.transporter = nodemailer.createTransport(options);
  }

  async sendPasswordResetOtpEmail(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"LearnHub" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'LearnHub Password Reset OTP',
      html: `
        <div style="margin:0;padding:40px 20px;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:35px;border:1px solid #e5e7eb;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
            <div style="text-align:center;margin-bottom:25px;">
              <h1 style="margin:0;color:#1976d2;font-size:28px;">LearnHub</h1>
              <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Learning. Growing. Succeeding.</p>
            </div>
            <h2 style="margin:0 0 15px;color:#172033;font-size:22px;">Password Reset Request</h2>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;">We received a request to reset your LearnHub account password.</p>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;">Use the verification code below to continue with your password reset.</p>
            <div style="margin:30px 0;padding:20px;text-align:center;background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;">
              <p style="margin:0 0 10px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Your verification code</p>
              <div style="color:#1976d2;font-size:34px;font-weight:700;letter-spacing:8px;">${otp}</div>
            </div>
            <p style="color:#4b5563;font-size:14px;line-height:1.6;">This OTP will expire in <strong>10 minutes</strong>.</p>
            <div style="margin-top:25px;padding:15px;background:#f9fafb;border-radius:8px;">
              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">🔒 For your security, never share this verification code with anyone.</p>
            </div>
            <p style="margin-top:25px;color:#6b7280;font-size:13px;line-height:1.6;">If you did not request a password reset, you can safely ignore this email.</p>
            <hr style="margin:30px 0 20px;border:0;border-top:1px solid #e5e7eb;" />
            <p style="margin:0;text-align:center;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} LearnHub LMS</p>
          </div>
        </div>
      `,
    });
  }

  async sendEmailVerificationOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"LearnHub" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Verify Your LearnHub Email',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;">
          <h2 style="color:#1976d2;">Welcome to LearnHub 🎓</h2>
          <p>Thank you for registering with LearnHub.</p>
          <p>Please use the following OTP to verify your email address:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#f4f6f8;padding:20px;text-align:center;border-radius:8px;margin:25px 0;">${otp}</div>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>If you did not create a LearnHub account, you can safely ignore this email.</p>
          <hr />
          <p style="color:#777;">LearnHub Team</p>
        </div>
      `,
    });
  }
}