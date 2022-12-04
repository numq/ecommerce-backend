import {injectable} from "inversify";

@injectable()
export class Config {
    readonly CACHE_URL = `${process.env.CACHE_HOST}://${process.env.CACHE_HOSTNAME}:${process.env.CACHE_PORT}`;
    readonly CACHE_NAME = process.env.CACHE_NAME;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
}