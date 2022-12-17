import {injectable} from "inversify";

@injectable()
export class Config {
    readonly SECRET_KEY = process.env.SECRET_KEY!;
    readonly CACHE_URL = `${process.env.CACHE_HOST}://${process.env.CACHE_HOSTNAME}:${process.env.CACHE_PORT}`;
    readonly CACHE_NAME = process.env.CACHE_NAME;
    readonly DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
    readonly DATABASE_NAME = process.env.DATABASE_NAME;
    readonly COLLECTION_ACCOUNTS = process.env.COLLECTION_ACCOUNTS;
    readonly COLLECTION_TOKENS = process.env.COLLECTION_TOKENS;
}
