import * as nodemailer from 'nodemailer';
import { env } from '../config/environment';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

interface ContactSubmissionData {
  name: string;
  email: string;
  date: Date;
  time: string;
  message: string;
}

// Send notification to admin about new contact submission
export const sendContactNotificationToAdmin = async (
  submission: ContactSubmissionData
): Promise<void> => {
  const formattedDate = new Date(submission.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: env.EMAIL_USER,
    to: env.ADMIN_EMAIL,
    subject: `🎬 New Meeting Request from ${submission.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #c79d4b 0%, #8b6e2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #c79d4b; margin-bottom: 5px; }
            .field-value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #c79d4b; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ New Meeting Request</h1>
              <p>AI Vision Studio</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">👤 Name:</div>
                <div class="field-value">${submission.name}</div>
              </div>

              <div class="field">
                <div class="field-label">📧 Email:</div>
                <div class="field-value"><a href="mailto:${submission.email}">${submission.email}</a></div>
              </div>

              <div class="field">
                <div class="field-label">📅 Date:</div>
                <div class="field-value">${formattedDate}</div>
              </div>

              <div class="field">
                <div class="field-label">⏰ Time:</div>
                <div class="field-value">${submission.time}</div>
              </div>

              <div class="field">
                <div class="field-label">💬 Message:</div>
                <div class="field-value">${submission.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message from your AI Vision Studio website.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification email sent for ${submission.name}`);
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    throw error;
  }
};

// Send confirmation to user who submitted the contact form
export const sendContactConfirmationToUser = async (
  submission: ContactSubmissionData
): Promise<void> => {
  const formattedDate = new Date(submission.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: env.EMAIL_USER,
    to: submission.email,
    subject: '✅ Meeting Request Confirmed - AI Vision Studio',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #c79d4b 0%, #8b6e2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: white; padding: 20px; border-radius: 5px; border-left: 3px solid #c79d4b; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Meeting Confirmed!</h1>
              <p>AI Vision Studio</p>
            </div>
            <div class="content">
              <p>Hi ${submission.name},</p>

              <p>Thank you for your interest in working together! I've received your meeting request and will get back to you shortly.</p>

              <div class="highlight">
                <strong>📅 Requested Date:</strong> ${formattedDate}<br>
                <strong>⏰ Requested Time:</strong> ${submission.time}
              </div>

              <p>I'll review your message and send you a calendar invite or alternative time slots if needed.</p>

              <p>Looking forward to connecting!</p>

              <p>Best regards,<br>
              <strong>AI Vision Studio</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation email from AI Vision Studio.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${submission.email}`);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    throw error;
  }
};

// Send test email to verify configuration
export const sendTestEmail = async (to: string): Promise<void> => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject: '✅ Email Service Test - AI Vision Studio',
    html: `
      <h2>Email Service is Working!</h2>
      <p>This is a test email from your AI Vision Studio backend.</p>
      <p>If you received this, your email configuration is correct.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    throw error;
  }
};
