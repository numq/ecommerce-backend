import {CatalogItem} from "./CatalogItem";
import {inject, injectable} from "inversify";
import {Collection, ObjectId} from "mongodb";
import {Types} from "../di/types";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {TaskEither} from "fp-ts/TaskEither";
import {DatabaseError} from "../database/DatabaseError";


export interface CatalogRepository {
    addItem(item: CatalogItem): TaskEither<Error, string>

    getItemById(id: string): TaskEither<Error, CatalogItem>

    getItemsByTags(tag: string[], skip: number, limit: number): TaskEither<Error, CatalogItem[]>

    updateItem(item: CatalogItem): TaskEither<Error, CatalogItem>

    removeItem(id: string): TaskEither<Error, string>
}

@injectable()
export class CatalogRepositoryImpl implements CatalogRepository {

    constructor(@inject(Types.catalog.collection) private readonly collection: Collection<CatalogItem>) {
    }

    addItem = (item: CatalogItem): TaskEither<Error, string> => pipe(
        TE.tryCatch(() => Promise.resolve<[ObjectId, number]>([new ObjectId(), new Date().getTime()]), () => DatabaseError.id),
        TE.chain(([id, timestamp]: [ObjectId, number]) =>
            TE.fromTask(() => this.collection.insertOne({
                _id: id,
                id: id.toHexString(),
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
        TE.fold(() => TE.left(DatabaseError.insert), ({insertedId}) => insertedId ? TE.right(insertedId.toHexString()) : TE.left(DatabaseError.insert))
    );

    getItemById = (id: string): TaskEither<Error, CatalogItem> => pipe(
        TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(id)})),
        TE.chain(TE.fromNullable(DatabaseError.findOne))
    );

    getItemsByTags = (tags: string[], skip: number, limit: number): TaskEither<Error, CatalogItem[]> => pipe(
        TE.fromTask(() => this.collection.find({tags: {$in: tags}}).skip(skip).limit(limit).toArray()),
        TE.mapLeft(() => DatabaseError.find)
    );

    updateItem = (item: CatalogItem): TaskEither<Error, CatalogItem> => pipe(
        TE.fromTask(() => this.collection.updateOne({_id: ObjectId.createFromHexString(item.id)}, {
            $set: {
                name: item.name,
                description: item.description,
                imageBytes: item.imageBytes,
                price: item.price,
                discount: item.discount,
                weight: item.weight,
                quantity: item.quantity,
                tags: item.tags,
                updatedAt: new Date().getTime()
            }
        })),
        TE.mapLeft(() => DatabaseError.update),
        TE.chain(() => TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(item.id)}))),
        TE.chain(TE.fromNullable(DatabaseError.findOne))
    );

    removeItem = (id: string): TaskEither<Error, string> => pipe(
        TE.fromTask(() => this.collection.deleteOne({_id: ObjectId.createFromHexString(id)})),
        TE.chain(({deletedCount}) => deletedCount > 0 ? TE.right(id) : TE.left(DatabaseError.deleteOne))
    );
}