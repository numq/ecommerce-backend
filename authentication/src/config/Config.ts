import {injectable} from "inversify";
import {Role} from "../role/Role";
import {Secret} from "jsonwebtoken";

@injectable()
export class Config {
    readonly SECRET_KEY_STAFF = process.env.SECRET_KEY_STAFF;
    readonly SECRET_KEY_COURIER = process.env.SECRET_KEY_COURIER;
    readonly SECRET_KEY_CUSTOMER = process.env.SECRET_KEY_CUSTOMER;
    readonly secretFromRole = (_: Role): Secret => {
        switch (_) {
            case Role.Staff:
                return this.SECRET_KEY_STAFF!;
            case Role.Courier:
                return this.SECRET_KEY_COURIER!;
            case Role.Customer:
                return this.SECRET_KEY_CUSTOMER!;
        }
    };
    readonly DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
    readonly DATABASE_NAME = process.env.DATABASE_NAME;
    readonly COLLECTION_ACCOUNTS = process.env.COLLECTION_ACCOUNTS;
}
