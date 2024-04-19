export abstract class CacheServiceAbstract {
    abstract set(key: string, otp: string, ttl?: number): Promise<void>;
    abstract get(key: string): Promise<string | undefined>;
    abstract delete(key: string): Promise<void>;
}
