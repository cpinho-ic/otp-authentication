import nodemailer, { type Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { DeliveryServiceAbstract } from '../@types';

export type NodemailerDeliveryServiceOptions = SMTPTransport.Options;

export type MailOptions = {
    from: string;
    subject: string;
    html: string;
    text?: string;
};

export class NodemailerDeliveryService implements DeliveryServiceAbstract {
    private static OTP_REGEX = /{{[Oo][Tt][Pp]}}/g;

    private transporter: Transporter;

    private mailOptions: MailOptions;

    constructor(options: NodemailerDeliveryServiceOptions, mailOptions: MailOptions) {
        this.transporter = nodemailer.createTransport(options);
        this.mailOptions = mailOptions;
    }

    async send(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.mailOptions.from,
            to: email,
            subject: this.mailOptions.subject,
            html: this.mailOptions.html.replaceAll(NodemailerDeliveryService.OTP_REGEX, otp),
            text: this.mailOptions.text?.replaceAll(NodemailerDeliveryService.OTP_REGEX, otp),
        });
    }
}
