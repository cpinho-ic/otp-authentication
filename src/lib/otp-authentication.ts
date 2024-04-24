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

    async request(to: string, ttl?: number): Promise<void> {
        const otp = this.otpGenerator();
        await this.cacheService.set(to, otp, ttl);
        await this.deliveryService.send(to, otp);
    }

    async verify(to: string, otp: string): Promise<boolean> {
        const savedOtp = await this.cacheService.get(to);
        if (savedOtp !== otp) {
            return false;
        }

        await this.cacheService.delete(to);
        return true;
    }
}
