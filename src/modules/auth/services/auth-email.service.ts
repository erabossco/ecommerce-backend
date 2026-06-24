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
            <h2> Hello ${firstName}</h2>
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


    // ============================
    // SEND PASSWORD RESET EMAIL
    // ============================

    async sendPasswordResetEmail(email: string, firstName: string, resetUrl: string) {
        await this.transporter.sendMail({
            to: email,
            subject: "Reset your password",
            html:
                `
            <div>
            Hello ${firstName}!

            <p>We received a request to reset your password.</p>
            <p>If this is you please <a href="${resetUrl}">RESET PASSWORD</a> here.</p>
            <p>If this request was not made by you, 
            someone may be attempting to access your account.</p>
            <p>Do not share this link with anyone.</p>

            <div>
            Thank you.
            ${envConfig.app.name}
            </div>
            </div>
            `
        });
    }
}

export const authEmailService = new AuthEmailService();