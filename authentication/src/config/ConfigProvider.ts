import "reflect-metadata";
import {injectable} from "inversify";
import * as dotenv from "dotenv";
import {createHash, randomBytes} from "crypto";

@injectable()
export class ConfigProvider {
    CACHE_URL: string;
    DATABASE_URL: string;
    GRPC_URL: string;
    SECRET_KEY: string;

    CACHE_NAME: string;
    DATABASE_NAME: string;

    COLLECTION_TOKENS: string;

    constructor() {
        dotenv.config();
        this.CACHE_URL = `${process.env.CACHE_HOST}://${process.env.CACHE_HOSTNAME}:${process.env.CACHE_PORT}`;
        this.DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
        this.GRPC_URL = `${process.env.GRPC_HOSTNAME}:${process.env.GRPC_PORT}`;
        this.SECRET_KEY = createHash('sha256').update(randomBytes(20).toString('hex')).digest('hex');

        this.CACHE_NAME = `${process.env.CACHE_NAME}`;
        this.DATABASE_NAME = `${process.env.DATABASE_NAME}`;

        this.COLLECTION_TOKENS = `${process.env.COLLECTION_TOKENS}`
    }
}
