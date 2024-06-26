import { type RedisClientOptions, type RedisClientType, type RedisFunctions, type RedisModules, type RedisScripts, createClient } from 'redis';
import type { CacheServiceAbstract } from '../@types';

export type RedisCacheServiceOptions = RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> & { prefix?: string };

export class RedisCacheService implements CacheServiceAbstract {
    private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

    private prefix?: string;

    constructor(options: RedisCacheServiceOptions) {
        this.client = createClient(options);
        this.prefix = options.prefix;
    }

    private async connectClient(): Promise<void> {
        while (!this.client.isReady) {
            await this.client.connect();
        }
    }

    private getKey(key: string): string {
        return `${this.prefix}otp_request_${key}`;
    }

    async set(key: string, otp: string, ttl?: number): Promise<void> {
        this.connectClient();
        await this.client.set(this.getKey(key), otp, {
            EX: ttl,
        });
    }

    async get(key: string): Promise<string | undefined> {
        this.connectClient();
        const result = await this.client.get(this.getKey(key));
        return result ?? undefined;
    }

    async delete(key: string): Promise<void> {
        this.connectClient();
        await this.client.del(this.getKey(key));
    }
}
