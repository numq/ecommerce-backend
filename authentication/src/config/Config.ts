import {injectable} from "inversify";
import {Role} from "../role/Role";
import {Secret} from "jsonwebtoken";

@injectable()
export class Config {
    readonly SECRET_KEY = process.env.SECRET_KEY!;
    readonly SECRET_KEY_STAFF = process.env.SECRET_KEY_STAFF!;
    readonly SECRET_KEY_COURIER = process.env.SECRET_KEY_COURIER!;
    readonly SECRET_KEY_CUSTOMER = process.env.SECRET_KEY_CUSTOMER!;
    readonly secretFromRole = (_: Role): Secret => {
        switch (_) {
            case Role.STAFF:
                return this.SECRET_KEY_STAFF;
            case Role.COURIER:
                return this.SECRET_KEY_COURIER;
            case Role.CUSTOMER:
                return this.SECRET_KEY_CUSTOMER;
        }
    };
    readonly TIME_TO_RETRY = 60000;
    readonly CACHE_URL = `${process.env.CACHE_HOST}://${process.env.CACHE_HOSTNAME}:${process.env.CACHE_PORT}`;
    readonly CACHE_NAME = process.env.CACHE_NAME;
    readonly DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
    readonly DATABASE_NAME = process.env.DATABASE_NAME;
    readonly COLLECTION_ACCOUNTS = process.env.COLLECTION_ACCOUNTS;
    readonly COLLECTION_TOKENS = process.env.COLLECTION_TOKENS;
}
