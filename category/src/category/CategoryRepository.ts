import {Category} from "./Category";
import {inject, injectable} from "inversify";
import {Collection, ObjectId} from "mongodb";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {TaskEither} from "fp-ts/TaskEither";
import {Types} from "../di/types";

export interface CategoryRepository {
    addCategory(category: Category): TaskEither<Error, string | null>

    getCategoryById(id: string): TaskEither<Error, Category | null>

    getCategories(skip: number, limit: number): TaskEither<Error, Category[]>

    getCategoriesByTags(tags: string[], skip: number, limit: number): TaskEither<Error, Category[]>

    updateCategory(category: Category): TaskEither<Error, Category | null>

    removeCategory(id: string): TaskEither<Error, string | null>
}

@injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
    constructor(@inject(Types.category.collection) private readonly collection: Collection<Category>) {
    }

    addCategory = (category: Category): TaskEither<Error, string | null> => pipe(
        TE.Do,
        TE.bind("id", () => TE.of(new ObjectId())),
        TE.bind("timestamp", () => TE.of(new Date().getTime())),
        TE.chain(({id, timestamp}) => TE.fromTask(() => this.collection.insertOne({
            _id: id,
            id: id.toHexString(),
            name: category.name,
            description: category.description,
            imageBytes: category.imageBytes,
            tags: category.tags,
            createdAt: timestamp,
            updatedAt: timestamp
        }))),
        TE.map(({insertedId}) => insertedId.toHexString())
    );

    getCategoryById = (id: string): TaskEither<Error, Category | null> => pipe(
        TE.fromTask(() => this.collection.findOne({id: id}))
    );

    getCategories = (skip: number, limit: number): TaskEither<Error, Category[]> => pipe(
        TE.fromTask(() => this.collection.find().skip(skip).limit(limit).toArray())
    );

    getCategoriesByTags = (tags: string[], skip: number, limit: number): TaskEither<Error, Category[]> => pipe(
        TE.fromTask(() => this.collection.find({tags: {$in: tags}}).skip(skip).limit(limit).toArray())
    );

    updateCategory = (category: Category): TaskEither<Error, Category | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndUpdate({id: category.id}, category)),
        TE.map(({value}) => value)
    );

    removeCategory = (id: string): TaskEither<Error, string | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndDelete({id: id})),
        TE.map(({value}) => value ? id : null)
    );
}