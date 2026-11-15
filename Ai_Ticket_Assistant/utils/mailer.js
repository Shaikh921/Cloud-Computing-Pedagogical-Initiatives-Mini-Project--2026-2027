import nodeMailer from 'nodemailer';

let transporter = null;

function getTransporter() {
    if (!transporter) {
        const host = process.env.MAILTRAP_SMTP_HOST || process.env.MAILTARP_SMTP_HOST || "sandbox.smtp.mailtrap.io";
        const port = Number(process.env.MAILTRAP_SMTP_PORT || process.env.MAILTARP_SMTP_PORT) || 2525;
        const user = process.env.MAILTRAP_SMTP_USER || process.env.MAILTARP_SMTP_USER;
        const pass = process.env.MAILTRAP_SMTP_PASS || process.env.MAILTARP_SMTP_PASSWORD || process.env.MAILTRAP_SMTP_PASSWORD;

        transporter = nodeMailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        });
    }
    return transporter;
}

export const sendEmail = async (to, subject, message) => {
    try {
        const mailClient = getTransporter();
        const info = await mailClient.sendMail({
            from: "AgenticAI Support <support@agenticai.com>",
            to,
            subject,
            text: message,
        });

        return info;
    } catch (error) {
        console.error("Error sending email via SMTP:", error.message);
        throw error;
    }
};
