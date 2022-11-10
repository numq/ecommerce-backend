import "reflect-metadata";
import {injectable} from "inversify";
import * as dotenv from "dotenv";
import {randomBytes} from "crypto";

@injectable()
export class ConfigProvider {
    DATABASE_URL: string
    CACHE_URL: string
    SECRET_KEY: string

    constructor() {
        dotenv.config();
        this.DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
        this.CACHE_URL = `${process.env.CACHE_HOST}://${process.env.CACHE_HOSTNAME}:${process.env.CACHE_PORT}`;
        this.SECRET_KEY = randomBytes(64).toString("hex")
    }
}
