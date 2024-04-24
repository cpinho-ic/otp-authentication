import Twilio, { type ClientOpts } from 'twilio';

import type { DeliveryServiceAbstract } from '../@types';

type InnerOpts = { smsTemplate: string; from: string };
export type TwilioOpts = ClientOpts & InnerOpts;

export class TwilioDeliveryService implements DeliveryServiceAbstract {
    private static OTP_REGEX = /{{[Oo][Tt][Pp]}}/g;

    private client;

    private innerOpts: InnerOpts;

    constructor(accountSid: string, authToken: string, opts: TwilioOpts) {
        this.client = Twilio(accountSid, authToken, opts);
        this.innerOpts = {
            smsTemplate: opts.smsTemplate,
            from: opts.from,
        };
    }

    async send(to: string, otp: string): Promise<void> {
        await this.client.messages.create({
            body: this.innerOpts.smsTemplate.replaceAll(TwilioDeliveryService.OTP_REGEX, otp),
            from: this.innerOpts.from,
            to,
        });
    }
}
