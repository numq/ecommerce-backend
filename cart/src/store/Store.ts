import {inject, injectable} from "inversify";
import {createClient, RedisClientType} from "redis";
import {Config} from "../config/Config";
import {Types} from "../di/types";

@injectable()
export class Store {
    client: RedisClientType | null = null;

    constructor(@inject(Types.app.config) private readonly config: Config) {
    }

    open = async () => new Promise<RedisClientType>((resolve, reject) => {
        try {
            resolve(createClient({
                name: this.config.REDIS_NAME,
                url: this.config.REDIS_URL
            }));
        } catch (e) {
            reject(e);
        }
    }).then(client => {
        client.connect().then(() => {
            this.client = client;
            console.log(`Connected to store: ${this.config.REDIS_URL}`);
        }).catch(console.error);
    }).catch(console.error);

    close = () => this.client?.disconnect().then(() => {
        console.log(`Disconnected from store: ${this.config.REDIS_URL}`);
        this.client = null;
    }).catch(console.error);
}