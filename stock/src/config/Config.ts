import {injectable} from "inversify";

@injectable()
export class Config {
    readonly DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
    readonly DATABASE_NAME = `${process.env.DATABASE_NAME}`;
    readonly COLLECTION_CATEGORIES = `${process.env.COLLECTION_CATEGORIES}`;
    readonly COLLECTION_PRODUCTS = `${process.env.COLLECTION_PRODUCTS}`;
}