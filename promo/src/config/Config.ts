import {injectable} from "inversify";

@injectable()
export class Config {
    readonly REDIS_URL = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`;
    readonly REDIS_NAME = process.env.REDIS_NAME;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
}