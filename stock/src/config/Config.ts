import "reflect-metadata";
import {injectable} from "inversify";
import * as dotenv from "dotenv";

@injectable()
export class Config {
    DATABASE_URL: string;
    SERVER_PORT: string;
    SERVER_URL: string;
    DATABASE_NAME: string;
    COLLECTION_CATEGORIES: string;
    COLLECTION_PRODUCTS: string;

    constructor() {
        dotenv.config();
        this.DATABASE_URL = `${process.env.DATABASE_HOST}://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
        this.SERVER_PORT = `${process.env.SERVER_PORT}`;
        this.SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
        this.DATABASE_NAME = `${process.env.DATABASE_NAME}`;
        this.COLLECTION_CATEGORIES = `${process.env.COLLECTION_CATEGORIES}`;
        this.COLLECTION_PRODUCTS = `${process.env.COLLECTION_PRODUCTS}`;
    }
}