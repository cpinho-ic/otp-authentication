import nodemailer, { type Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { DeliveryServiceAbstract } from '../@types';

export type NodemailerDeliveryServiceOptions = SMTPTransport.Options;

export class NodemailerDeliveryService implements DeliveryServiceAbstract {
    private transporter: Transporter;

    constructor(options: NodemailerDeliveryServiceOptions) {
        this.transporter = nodemailer.createTransport(options);
    }

    async send(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: '"Gonzalo Abshire 👻" <gonzalo.abshire67@ethereal.email>', // sender address
            to: email, // list of receivers
            subject: 'OTP', // Subject line
            text: `OTP: ${otp}`, // plain text body
            html: `<b>OTP</b>: ${otp}`, // html body
        });
    }
}
