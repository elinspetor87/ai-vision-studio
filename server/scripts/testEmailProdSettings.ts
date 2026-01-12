
import mongoose from 'mongoose';
import * as nodemailer from 'nodemailer';
import Settings from '../src/models/Settings';
import * as fs from 'fs';

const PROD_URI = 'mongodb+srv://admin:VDUSOew6XrpSnK8b@ai-vision-studio.lh3f3rh.mongodb.net/?appName=ai-vision-studio';
const LOG_FILE = 'email_debug.log';

async function testEmailWithProdSettings() {
    let logMsg = '';
    const log = (msg: string) => {
        console.log(msg);
        logMsg += msg + '\n';
    };

    try {
        log('📡 Connecting to PRODUCTION database...');
        await mongoose.connect(PROD_URI);

        const settings = await Settings.findOne();
        if (!settings || !settings.emailSettings || !settings.emailSettings.user || !settings.emailSettings.pass) {
            log('❌ Could not find complete email settings in DB.');
            return;
        }

        const { host, port, user, pass, secure } = settings.emailSettings;
        log(`🔌 SMTP: ${host || 'smtp.gmail.com'}:${port || 587}`);
        log(`📧 User: ${user}`);

        const transporter = nodemailer.createTransport({
            host: host || 'smtp.gmail.com',
            port: port || 587,
            secure: secure !== undefined ? secure : false,
            auth: { user, pass },
            tls: { rejectUnauthorized: false },
            family: 4
        } as any);

        log('⏳ Verifying connection...');
        await transporter.verify();
        log('✅ Connection Verified!');

        log('📬 Sending test...');
        const info = await transporter.sendMail({
            from: user,
            to: user,
            subject: 'AI Vision Studio - Email Test',
            text: 'Test message.'
        });

        log('✅ Email Sent! ID: ' + info.messageId);

    } catch (error: any) {
        log('\n❌ FAILED:');
        log('   - Message: ' + error.message);
        log('   - Code: ' + error.code);
        if (error.response) log('   - Response: ' + error.response);
    } finally {
        fs.writeFileSync(LOG_FILE, logMsg);
        await mongoose.disconnect();
    }
}

testEmailWithProdSettings();
