import {Category} from "./Category";
import {inject, injectable} from "inversify";
import {Collection, ObjectId} from "mongodb";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {TaskEither} from "fp-ts/TaskEither";
import {DatabaseError} from "../database/DatabaseError";
import {Types} from "../di/types";

export interface CategoryRepository {
    addCategory(category: Category): TaskEither<Error, string>

    getCategoryById(id: string): TaskEither<Error, Category>

    getCategories(skip: number, limit: number): TaskEither<Error, Category[]>

    updateCategory(category: Category): TaskEither<Error, Category>

    removeCategory(id: string): TaskEither<Error, string>
}

@injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
    constructor(@inject(Types.category.collection) private readonly collection: Collection<Category>) {
    }

    addCategory = (category: Category): TaskEither<Error, string> => pipe(
        TE.tryCatch(() => Promise.resolve<[ObjectId, number]>([new ObjectId(), new Date().getTime()]), () => DatabaseError.id),
        TE.chain(([id, timestamp]: [ObjectId, number]) =>
            TE.fromTask(() => this.collection.insertOne({
                _id: id,
                id: id.toHexString(),
                name: category.name,
                description: category.description,
                imageBytes: category.imageBytes,
                createdAt: timestamp,
                updatedAt: timestamp
            }))),
        TE.fold(() => TE.left(DatabaseError.insert), ({insertedId}) => insertedId ? TE.right(insertedId.toHexString()) : TE.left(DatabaseError.insert))
    );

    getCategoryById = (id: string): TaskEither<Error, Category> => pipe(
        TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(id)})),
        TE.chain(TE.fromNullable(DatabaseError.findOne))
    );

    getCategories = (skip: number, limit: number): TaskEither<Error, Category[]> => pipe(
        TE.fromTask(() => this.collection.find().skip(skip).limit(limit).toArray()),
        TE.mapLeft(() => DatabaseError.find)
    );

    updateCategory = (category: Category): TaskEither<Error, Category> => pipe(
        TE.fromTask(() => this.collection.updateOne({_id: ObjectId.createFromHexString(category.id)}, {
            $set: {
                name: category.name,
                description: category.description,
                imageBytes: category.imageBytes,
                updatedAt: new Date().getTime()
            }
        })),
        TE.mapLeft(() => DatabaseError.update),
        TE.chain(() => TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(category.id)}))),
        TE.chain(TE.fromNullable(DatabaseError.findOne))
    );

    removeCategory = (id: string): TaskEither<Error, string> => pipe(
        TE.fromTask(() => this.collection.deleteOne({_id: ObjectId.createFromHexString(id)})),
        TE.chain(({deletedCount}) => deletedCount > 0 ? TE.right(id) : TE.left(DatabaseError.deleteOne))
    );
}