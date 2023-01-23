import {injectable} from "inversify";

@injectable()
export class Config {
    readonly MONGO_URL = `mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}`;
    readonly SERVER_URL = `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;
    readonly DATABASE_NAME = process.env.DATABASE_NAME;
    readonly COLLECTION_ITEMS = process.env.COLLECTION_ITEMS;
    readonly AMQP_URL = `amqp://${process.env.AMQP_HOSTNAME}:${process.env.AMQP_PORT}`;
    readonly AMQP_CHANNEL_CATALOG = process.env.AMQP_CHANNEL_CATALOG;
}