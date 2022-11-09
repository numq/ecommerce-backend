import "reflect-metadata";
import {createClient, RedisClientType} from "redis";
import {injectable} from "inversify";

@injectable()
export class Store {

    url: string;
    client?: RedisClientType | null = null;

    constructor(url: string) {
        this.url = url;
    }

    open = async (): Promise<void> => {
        this.client = createClient({url: this.url});
        this.client?.connect().then(() => {
            console.log(`Connected to store: ${this.url}`);
        }).catch(console.error);
    }

    close = async (): Promise<void> => this.client?.disconnect().then(() => {
        console.log(`Disconnected from store: ${this.url}`);
        this.client = null;
    }).catch(console.error);

}