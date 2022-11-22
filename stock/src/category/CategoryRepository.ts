import {Either} from "fp-ts/Either";
import {Exception} from "../exception/Exception";
import {Category} from "./Category";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {Collection} from "mongodb";
import {wrap} from "../wrapper/Promise";
import {either} from "fp-ts";
import {pipe} from "fp-ts/function";
import {CategoryException} from "./CategoryException";

export interface CategoryRepository {
    addCategory(category: Category): Either<Exception, string>

    getCategoryById(id: string): Either<Exception, Category>

    getCategories(): Either<Exception, Category[]>

    updateCategory(category: Category): Either<Exception, Category>

    removeCategory(id: string): Either<Exception, string>
}

@injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
    constructor(@inject(Types.category.collection) private readonly collection: Collection<Category>) {
    }

    addCategory(category: Category): Either<Exception, string> {
        return pipe(
            wrap(this.collection.insertOne(category), CategoryException.insert),
            either.map(x => x.insertedId.toHexString())
        );
    }

    getCategoryById(id: string): Either<Exception, Category> {
        return pipe(
            wrap(this.collection.findOne({id: id}), CategoryException.getById),
            either.chain(either.fromNullable(CategoryException.getById))
        );
    }

    getCategories(): Either<Exception, Category[]> {
        return wrap(this.collection.find().toArray(), CategoryException.get);
    }

    updateCategory(category: Category): Either<Exception, Category> {
        return pipe(
            wrap(this.collection.updateOne({id: category.id}, {
                name: category.name,
                description: category.description,
                imageBytes: category.imageBytes
            }), CategoryException.update),
            either.chain(_ => wrap(this.collection.findOne({id: category.id}), CategoryException.getById)),
            either.chain(either.fromNullable(CategoryException.getById))
        );
    }

    removeCategory(id: string): Either<Exception, string> {
        return pipe(
            wrap(this.collection.deleteOne({id: id}), CategoryException.remove),
            either.map(_ => id)
        );
    }

}