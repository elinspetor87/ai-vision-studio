import * as nodemailer from 'nodemailer';
import { env, isProduction } from '../config/environment';

import Settings from '../models/Settings';

// Dynamic transporter creator
const getTransporter = async () => {
  // Try to get settings from DB
  let emailSettings = null;
  try {
    const settings = await Settings.findOne();
    if (settings && settings.emailSettings && settings.emailSettings.user) {
      emailSettings = settings.emailSettings;
    }
  } catch (error) {
    console.warn('⚠️ Could not fetch email settings from DB, using fallback');
  }

  // Determine credentials (DB or Env Fallback)
  // Default to env vars if DB settings are empty strings
  const host = (emailSettings?.host) || 'smtp.gmail.com';
  const port = (emailSettings?.port) || 587;
  const user = (emailSettings?.user) || env.EMAIL_USER;
  const pass = (emailSettings?.pass) || env.EMAIL_APP_PASSWORD;
  const secure = (emailSettings?.secure) !== undefined ? emailSettings.secure : false;

  if (!user || !pass) {
    console.warn('❌ No email credentials found (DB or Env)');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    // @ts-ignore
    family: 4
  } as any);
};

// Helper middleware to send mail with dynamic transporter
const sendMail = async (options: nodemailer.SendMailOptions) => {
  const transporter = await getTransporter();
  try {
    console.log(`📧 Attempting to send email to: ${options.to}`);
    const info = await transporter.sendMail(options);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('❌ Failed to send email:');
    console.error('   - Error:', error.message);
    console.error('   - Code:', error.code);
    throw error;
  }
};

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
    await sendMail(mailOptions);
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
    await sendMail(mailOptions);
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
    await sendMail(mailOptions);
    console.log(`✅ Test email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    throw error;
  }
};

// Send welcome email to new newsletter subscriber
export const sendNewsletterWelcomeEmail = async (email: string): Promise<void> => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to: email,
    subject: '🎉 Welcome to the AI Vision Studio Community!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; background: linear-gradient(to right, #c79d4b, #f5d07a, #c79d4b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .content { padding: 40px 30px; }
            .content p { font-size: 16px; color: #555; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #c79d4b 0%, #8b6e2d 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; }
            .footer { background-color: #f9f9f9; text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #eee; }
            .footer a { color: #888; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome Aboard! 🎬</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for subscribing to the <strong>AI Vision Studio</strong> newsletter! We're thrilled to have you as part of our community of filmmakers and VFX artists.</p>
              <p>Here's what you can expect from us:</p>
              <ul style="color: #555; margin-bottom: 25px;">
                <li>🚀 Latest trends in AI filmmaking</li>
                <li>🎥 Behind-the-scenes VFX breakdowns</li>
                <li>🛠️ Exclusive tutorials and tips</li>
                <li>📢 Updates on new projects and films</li>
              </ul>
              <div style="text-align: center;">
                <a href="${env.CLIENT_URL || 'http://localhost:3000'}/blog" class="btn">Read Our Latest Posts</a>
              </div>
            </div>
            <div class="footer">
              <p>You received this email because you subscribed on our website.</p>
              <p>AI Vision Studio</p>
              <p><a href="${env.CLIENT_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${email}">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sendMail(mailOptions);
    console.log(`✅ Newsletter welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending newsletter welcome email:', error);
    // Don't throw error to avoid failing the subscription request
  }
};
