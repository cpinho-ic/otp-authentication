import { RedisCacheService, type RedisCacheServiceOptions } from './lib/redis-cache-service';

import { NodemailerDeliveryService, type NodemailerDeliveryServiceOptions, type MailOptions } from './lib/nodemailer-delivery-service';
import { OTPAuthentication } from './lib/otp-authentication';

import { generate } from 'otp-generator';
import { TwilioDeliveryService, type TwilioOpts } from './lib/sms-delivery-service';

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
