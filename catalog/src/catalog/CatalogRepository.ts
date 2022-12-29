import {CatalogItem} from "./CatalogItem";
import {inject, injectable} from "inversify";
import {Collection, ObjectId} from "mongodb";
import {Types} from "../di/types";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {TaskEither} from "fp-ts/TaskEither";


export interface CatalogRepository {
    addItem(item: CatalogItem): TaskEither<Error, string | null>

    getItemById(id: string): TaskEither<Error, CatalogItem | null>

    getItemsByTags(tag: string[], skip: number, limit: number): TaskEither<Error, CatalogItem[]>

    updateItem(item: CatalogItem): TaskEither<Error, CatalogItem | null>

    removeItem(id: string): TaskEither<Error, string | null>
}

@injectable()
export class CatalogRepositoryImpl implements CatalogRepository {

    constructor(@inject(Types.catalog.collection) private readonly collection: Collection<CatalogItem>) {
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
        TE.map(({insertedId}) => insertedId.toHexString())
    );

    getItemById = (id: string): TaskEither<Error, CatalogItem | null> => pipe(
        TE.fromTask(() => this.collection.findOne({id: id}))
    );

    getItemsByTags = (tags: string[], skip: number, limit: number): TaskEither<Error, CatalogItem[]> => pipe(
        TE.fromTask(() => this.collection.find({tags: {$in: tags}}).skip(skip).limit(limit).toArray())
    );

    updateItem = (item: CatalogItem): TaskEither<Error, CatalogItem | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndUpdate({id: item.id}, item)),
        TE.map(({value}) => value)
    );

    removeItem = (id: string): TaskEither<Error, string | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndDelete({id: id})),
        TE.map(({value}) => value ? id : null)
    );
}