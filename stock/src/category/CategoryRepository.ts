import {Category} from "./Category";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {Collection, ObjectId} from "mongodb";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {TaskEither} from "fp-ts/TaskEither";
import {DatabaseError} from "../database/DatabaseError";

export interface CategoryRepository {
    addCategory(category: Category): TaskEither<Error, string>

    getCategoryById(id: string): TaskEither<Error, Category>

    getCategories(): TaskEither<Error, Category[]>

    updateCategory(category: Category): TaskEither<Error, Category>

    removeCategory(id: string): TaskEither<Error, string>
}

@injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
    constructor(@inject(Types.category.collection) private readonly collection: Collection<Category>) {
    }

    addCategory = (category: Category): TaskEither<Error, string> => {
        return pipe(
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
            TE.bimap(() => DatabaseError.insert, _ => _.insertedId.toHexString())
        );
    }

    getCategoryById = (id: string): TaskEither<Error, Category> => {
        return pipe(
            TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(id)})),
            TE.chain(TE.fromNullable(DatabaseError.findOne))
        );
    }

    getCategories = (): TaskEither<Error, Category[]> => {
        return pipe(
            TE.fromTask(() => this.collection.find().toArray()),
            TE.mapLeft(() => DatabaseError.find)
        );
    }

    updateCategory = (category: Category): TaskEither<Error, Category> => {
        return pipe(
            TE.fromTask(() => this.collection.updateOne({_id: ObjectId.createFromHexString(category.id)}, {
                $set: {
                    name: category.name,
                    description: category.description,
                    imageBytes: category.imageBytes,
                    updatedAt: new Date().getTime()
                }
            })),
            TE.mapLeft(() => DatabaseError.update),
            TE.chain(() =>
                TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(category.id)}))),
            TE.chain(TE.fromNullable(DatabaseError.findOne))
        );
    }

    removeCategory = (id: string): TaskEither<Error, string> => {
        return pipe(
            TE.fromTask(() => this.collection.deleteOne({_id: ObjectId.createFromHexString(id)})),
            TE.bimap(() => DatabaseError.deleteOne, () => id)
        );
    }

}