import nodemailer from 'nodemailer';

/**
 * Email Service
 * Handles all email sending functionality
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CollegeBuddy <noreply@collegebuddy.com>',
      to: email,
      subject: 'Verify Your CollegeBuddy Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #575799;">CollegeBuddy</h1>
          <h2>Verify Your Email</h2>
          <p>Thank you for signing up! Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #575799; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">This link expires in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent to ${email}`);
  } catch (error) {
    console.error('Email send error:', error);
    // Don't throw - registration should still work
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CollegeBuddy <noreply@collegebuddy.com>',
      to: email,
      subject: 'Reset Your CollegeBuddy Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #575799;">CollegeBuddy</h1>
          <h2>Reset Your Password</h2>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #575799; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">This link expires in 1 hour.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Reset password email sent to ${email}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
};