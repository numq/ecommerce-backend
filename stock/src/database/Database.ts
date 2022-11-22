import {Document, MongoClient} from "mongodb";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {Config} from "../config/Config";

@injectable()
export class Database {

    client: MongoClient | null = null;

    constructor(@inject(Types.app.config) private readonly config: Config) {
    }

    open = async () => new MongoClient(this.config.DATABASE_URL).connect().then(client => {
        this.client = client;
        console.log(`Connected to database: ${this.config.DATABASE_URL}`);
    }).catch(console.error);

    close = async () => this.client?.close().then(() => {
        console.log(`Disconnected from database: ${this.config.DATABASE_URL}`);
        this.client = null;
    }).catch(console.error);

    collection = <T extends Document>(name: string) => this.client?.db(this.config.DATABASE_NAME).collection<T>(name)

}