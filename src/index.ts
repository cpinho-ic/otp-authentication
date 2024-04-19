import { RedisCacheService, type RedisCacheServiceOptions } from './lib/redis-cache-service';

import { NodemailerDeliveryService, type NodemailerDeliveryServiceOptions } from './lib/email-delivery-service';
import { OTPAuthentication } from './lib/otp-authentication';

import { generate } from 'otp-generator';

export class EmailOTPAuthentication extends OTPAuthentication {
    constructor(redisOptions: RedisCacheServiceOptions, nodemailerOptions: NodemailerDeliveryServiceOptions) {
        super(
            () => generate(6, { lowerCaseAlphabets: false, specialChars: false }),
            new RedisCacheService(redisOptions),
            new NodemailerDeliveryService(nodemailerOptions),
        );
    }
}

export * from './@types';
