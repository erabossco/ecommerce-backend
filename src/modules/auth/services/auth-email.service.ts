import nodemailer from "nodemailer";

import { envConfig } from "@/config/env/index.js";

class AuthEmailService {
    private transporter = nodemailer.createTransport({
        host: envConfig.mail.host,
        port: envConfig.mail.port,
        secure: envConfig.mail.port === 465,
        auth: {
            user: envConfig.mail.user,
            pass: envConfig.mail.pass,
        }
    });

    // =============================
    // SEND EMAIL VERIFICATION EMAIL
    // =============================

    async sendVerificationEmail(email: string, firstName: string, verificationUrl: string) {
        await this.transporter.sendMail({
            to: email,
            subject: "Verify your email",
            html: `
            <div>
            <h2> Hello ${firstName}
            <p>Greetings from ${envConfig.app.name}!</p>
            <div>
            <p>Please verify your email address.</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link will expire soon.</p>
            </div>
            <div>
            <p>Thank you.<p/>
            <p>${envConfig.app.name}</p>
            </div>
            </div>
            `
        });
    }
}

export const authEmailService = new AuthEmailService();