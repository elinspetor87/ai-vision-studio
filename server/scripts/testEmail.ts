
import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Carrega .env explicitamente
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('--- Email Diagnostic Script ---');
console.log('USER:', process.env.EMAIL_USER ? 'Definido (***)' : 'MISSING');
console.log('PASS:', process.env.EMAIL_APP_PASSWORD ? 'Definido (***)' : 'MISSING');

const testEmail = async () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        console.error('❌ Credentials missing in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
        family: 4
    } as any);

    try {
        console.log('Verifying configuration...');
        await transporter.verify();
        console.log('✅ SMTP Configuration Valid');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Envia para si mesmo
            subject: 'Email Diagnostics Test',
            text: 'If you see this, email sending works.',
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error: any) {
        console.error('❌ Failed to send email:');
        console.error(error);
    }
};

testEmail();
