import nodemailer from 'nodemailer';
import { env, isProduction } from '../config/environment';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER || 'felipe.almeida.fx@gmail.com',
    pass: env.EMAIL_PASSWORD || env.EMAIL_APP_PASSWORD || '', // App password from Gmail
  },
  tls: {
    // Allow self-signed certificates in development
    rejectUnauthorized: isProduction,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `"AI Vision Studio" <${env.EMAIL_USER || 'felipe.almeida.fx@gmail.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${options.to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  newComment: (commentData: {
    postTitle: string;
    postSlug: string;
    authorName: string;
    authorEmail: string;
    content: string;
  }) => ({
    subject: `🆕 Novo comentário em "${commentData.postTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f5f5f5; padding: 20px; border-radius: 0 0 5px 5px; }
          .comment-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #f97316; border-radius: 4px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🆕 Novo Comentário Pendente</h1>
          </div>
          <div class="content">
            <p>Olá Felipe,</p>
            <p>Um novo comentário foi enviado no post <strong>"${commentData.postTitle}"</strong> e está aguardando sua aprovação.</p>

            <div class="comment-box">
              <p><strong>De:</strong> ${commentData.authorName} (${commentData.authorEmail})</p>
              <p><strong>Comentário:</strong></p>
              <p>${commentData.content}</p>
            </div>

            <a href="http://localhost:8080/admin/comments" class="button">Ver Comentários Pendentes</a>

            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              <strong>Post:</strong> <a href="http://localhost:8080/blog/${commentData.postSlug}">${commentData.postTitle}</a>
            </p>
          </div>
          <div class="footer">
            <p>AI Vision Studio - Sistema de Notificações</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  commentApproved: (commentData: {
    postTitle: string;
    postSlug: string;
    authorName: string;
    authorEmail: string;
  }) => ({
    subject: `✅ Seu comentário foi aprovado - "${commentData.postTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f5f5f5; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Comentário Aprovado!</h1>
          </div>
          <div class="content">
            <p>Olá ${commentData.authorName},</p>
            <p>Seu comentário no post <strong>"${commentData.postTitle}"</strong> foi aprovado e agora está visível no site!</p>

            <a href="http://localhost:8080/blog/${commentData.postSlug}" class="button">Ver Comentário no Post</a>

            <p style="margin-top: 20px;">Obrigado por compartilhar seus pensamentos!</p>
          </div>
          <div class="footer">
            <p>AI Vision Studio</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};
