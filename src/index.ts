import { RedisCacheService, type RedisCacheServiceOptions } from './lib/redis-cache-service';

import { NodemailerDeliveryService, type NodemailerDeliveryServiceOptions, type MailOptions } from './lib/email-delivery-service';
import { OTPAuthentication } from './lib/otp-authentication';

import { generate } from 'otp-generator';

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

export * from './@types';
