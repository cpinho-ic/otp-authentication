export abstract class DeliveryServiceAbstract {
    abstract send(to: string, otp: string): Promise<void>;
}
