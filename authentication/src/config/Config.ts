import {injectable} from "inversify";
import {createHash, randomBytes} from "crypto";

@injectable()
export class Config {
    readonly SECRET_KEY = createHash('sha256').update(randomBytes(20).toString('hex')).digest('hex');
    readonly DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
    readonly DATABASE_NAME = process.env.DATABASE_NAME;
    readonly COLLECTION_CATEGORIES = process.env.COLLECTION_CATEGORIES;
    readonly COLLECTION_PRODUCTS = process.env.COLLECTION_PRODUCTS;
}
