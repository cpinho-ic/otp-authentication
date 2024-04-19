import type { CacheServiceAbstract } from '../@types/cache-service-abstract';
import type { DeliveryServiceAbstract } from '../@types/delivery-service-abstract';
import type { OTPGeneratorFunction } from '../@types/otp-generator-function';

export class OTPAuthentication {
    private otpGenerator: OTPGeneratorFunction;

    private cacheService: CacheServiceAbstract;

    private deliveryService: DeliveryServiceAbstract;

    constructor(otpGenerator: OTPGeneratorFunction, cacheService: CacheServiceAbstract, deliveryService: DeliveryServiceAbstract) {
        this.otpGenerator = otpGenerator;
        this.cacheService = cacheService;
        this.deliveryService = deliveryService;
    }

    async request(email: string, ttl?: number): Promise<void> {
        const otp = this.otpGenerator();
        await this.cacheService.set(email, otp, ttl);
        await this.deliveryService.send(email, otp);
    }

    async verify(email: string, otp: string): Promise<boolean> {
        const savedOtp = await this.cacheService.get(email);
        if (savedOtp !== otp) {
            return false;
        }

        await this.cacheService.delete(email);
        return true;
    }
}
