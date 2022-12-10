import {inject, injectable} from "inversify";
import {createClient, RedisClientType} from "redis";
import {Config} from "../config/Config";
import {Types} from "../di/types";

@injectable()
export class Cache {
    client: RedisClientType | null = null;

    constructor(@inject(Types.app.config) private readonly config: Config) {
    }

    open = async () => new Promise<RedisClientType>((resolve, reject) => {
        try {
            resolve(createClient({
                name: this.config.CACHE_NAME,
                url: this.config.CACHE_URL
            }));
        } catch (e) {
            reject(e);
        }
    }).then(client => {
        client.connect().then(() => {
            this.client = client;
            console.log(`Connected to cache: ${this.config.CACHE_URL}`);
        }).catch(console.error);
    }).catch(console.error);

    close = () => this.client?.disconnect().then(() => {
        console.log(`Disconnected from cache: ${this.config.CACHE_URL}`);
        this.client = null;
    }).catch(console.error);
}