import {CatalogItem} from "./CatalogItem";
import {inject, injectable} from "inversify";
import {Collection, ObjectId, Sort} from "mongodb";
import {Types} from "../di/types";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {TaskEither} from "fp-ts/TaskEither";
import {Channel} from "amqplib";
import {Buffer} from "buffer";
import {SortType} from "./SortType";


export interface CatalogRepository {
    addItem(item: CatalogItem): TaskEither<Error, string | null>

    getItemById(id: string): TaskEither<Error, CatalogItem | null>

    getItemsByTags(tag: string[], sortType: SortType, skip: number, limit: number): TaskEither<Error, CatalogItem[]>

    updateItem(item: CatalogItem): TaskEither<Error, CatalogItem | null>

    removeItem(id: string): TaskEither<Error, string | null>
}

@injectable()
export class CatalogRepositoryImpl implements CatalogRepository {

    constructor(
        @inject(Types.catalog.channel) private readonly channel: Channel,
        @inject(Types.catalog.collection) private readonly collection: Collection<CatalogItem>
    ) {
    }

    addItem = (item: CatalogItem): TaskEither<Error, string | null> => pipe(
        TE.Do,
        TE.bind("id", () => TE.of(new ObjectId())),
        TE.bind("timestamp", () => TE.of(new Date().getTime())),
        TE.chain(({id, timestamp}) => TE.fromTask(() => this.collection.insertOne({
            _id: id,
            id: id.toHexString(),
            sku: item.sku,
            name: item.name,
            description: item.description,
            imageBytes: item.imageBytes,
            price: item.price,
            discount: item.discount,
            weight: item.weight,
            quantity: item.quantity,
            tags: item.tags,
            createdAt: timestamp,
            updatedAt: timestamp
        }))),
        TE.chain(({insertedId}) => TE.fromTask(() => this.collection.findOne({id: insertedId.toHexString()}))),
        TE.chain(result => TE.of(result ? this.channel.sendToQueue("add", Buffer.from(JSON.stringify(result))) : false)),
        TE.map(() => item.id)
    );

    getItemById = (id: string): TaskEither<Error, CatalogItem | null> => pipe(
        TE.fromTask(() => this.collection.findOne({id: id}))
    );

    getItemsByTags = (tags: string[], sort_type: SortType, skip: number, limit: number): TaskEither<Error, CatalogItem[]> => pipe(
        TE.Do,
        TE.bind("sort_type", () => {
            let sorting_filter: Sort;

            const CHEAPEST_FIRST: Sort = {price: 1};
            const EXPENSIVE_FIRST: Sort = {price: -1};
            const DISCOUNTER_FIRST: Sort = {discount: 1};
            const NEWEST_FIRST: Sort = {createdAt: -1, updatedAt: -1};
            const ALPHABETICALLY: Sort = {name: 1};

            switch (sort_type) {
                case SortType.CHEAPEST_FIRST: {
                    sorting_filter = CHEAPEST_FIRST;
                    break
                }
                case SortType.EXPENSIVE_FIRST: {
                    sorting_filter = EXPENSIVE_FIRST;
                    break
                }
                case SortType.DISCOUNTED_FIRST: {
                    sorting_filter = DISCOUNTER_FIRST;
                    break
                }
                case SortType.NEWEST_FIRST: {
                    sorting_filter = NEWEST_FIRST;
                    break
                }
                case SortType.ALPHABETICALLY: {
                    sorting_filter = ALPHABETICALLY;
                    break
                }
                default: {
                    sorting_filter = NEWEST_FIRST;
                    break
                }
            }
            return TE.of(sorting_filter);
        }),
        TE.chain(({sort_type}) => TE.fromTask(() => this.collection.find({tags: {$in: tags}}).sort(sort_type).skip(skip).limit(limit).toArray()))
    );

    updateItem = (item: CatalogItem): TaskEither<Error, CatalogItem | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndUpdate({id: item.id}, item)),
        TE.chainFirst(({value}) => TE.of(value ? this.channel.sendToQueue("update", Buffer.from(JSON.stringify(value))) : false)),
        TE.map(({value}) => value)
    );

    removeItem = (id: string): TaskEither<Error, string | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndDelete({id: id})),
        TE.chainFirst(result => TE.of(this.channel.sendToQueue("delete", Buffer.from(JSON.stringify(result))))),
        TE.map(({value}) => value ? id : null)
    );
}