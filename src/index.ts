import { type MailOptions, NodemailerDeliveryService, type NodemailerDeliveryServiceOptions } from './lib/nodemailer-delivery-service';
import { RedisCacheService, type RedisCacheServiceOptions } from './lib/redis-cache-service';
import { TwilioDeliveryService, type TwilioOpts } from './lib/twilio-delivery-service';

import { generate } from 'otp-generator';
import { OTPAuthentication } from './lib/otp-authentication';

export class EmailOTPAuthentication extends OTPAuthentication {
    constructor(
        redisOptions: RedisCacheServiceOptions,
        deliveryServiceOptions: { nodemailerOptions: NodemailerDeliveryServiceOptions; mailOptions: MailOptions },
    ) {
        super(
            () => generate(6, { lowerCaseAlphabets: false, specialChars: false }),
            new RedisCacheService(redisOptions),
            new NodemailerDeliveryService(deliveryServiceOptions.nodemailerOptions, deliveryServiceOptions.mailOptions),
        );
    }
}

export class SMSOTPAuthentication extends OTPAuthentication {
    constructor(redisOptions: RedisCacheServiceOptions, deliveryServiceOptions: { accountSid: string; authToken: string; opts: TwilioOpts }) {
        super(
            () => generate(6, { lowerCaseAlphabets: false, specialChars: false }),
            new RedisCacheService(redisOptions),
            new TwilioDeliveryService(deliveryServiceOptions.accountSid, deliveryServiceOptions.authToken, deliveryServiceOptions.opts),
        );
    }
}

export * from './@types';
export * from './lib';
