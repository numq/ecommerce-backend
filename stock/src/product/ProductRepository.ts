import {Product} from "./Product";
import {inject, injectable} from "inversify";
import {Collection, ObjectId} from "mongodb";
import {Types} from "../di/types";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {TaskEither} from "fp-ts/TaskEither";
import {DatabaseError} from "../database/DatabaseError";

export interface ProductRepository {
    addProduct(product: Product): TaskEither<Error, string>

    getProductById(id: string): TaskEither<Error, Product>

    getProductsFromCategory(categoryId: string, skip: number, limit: number): TaskEither<Error, Product[]>

    updateProduct(product: Product): TaskEither<Error, Product>

    removeProduct(id: string): TaskEither<Error, string>
}

@injectable()
export class ProductRepositoryImpl implements ProductRepository {
    constructor(@inject(Types.product.collection) private readonly collection: Collection<Product>) {
    }

    addProduct(product: Product): TaskEither<Error, string> {
        return pipe(
            TE.tryCatch(() => Promise.resolve<[ObjectId, number]>([new ObjectId(), new Date().getTime()]), () => DatabaseError.id),
            TE.chain(([id, timestamp]: [ObjectId, number]) =>
                TE.fromTask(() => this.collection.insertOne({
                    _id: id,
                    id: id.toHexString(),
                    name: product.name,
                    description: product.description,
                    imageBytes: product.imageBytes,
                    price: product.price,
                    discount: product.discount,
                    weight: product.weight,
                    quantity: product.quantity,
                    categoryId: product.categoryId,
                    tags: product.tags,
                    createdAt: timestamp,
                    updatedAt: timestamp
                }))),
            TE.mapLeft(e => e ? e : DatabaseError.insert),
            TE.map(_ => _.insertedId.toHexString())
        );
    }

    getProductById(id: string): TaskEither<Error, Product> {
        return pipe(
            TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(id)})),
            TE.mapLeft(e => e ? e : DatabaseError.findOne),
            TE.chain(TE.fromNullable(DatabaseError.findOne))
        );
    }

    getProductsFromCategory(categoryId: string, skip: number, limit: number): TaskEither<Error, Product[]> {
        return pipe(
            TE.fromTask(() => this.collection.find({categoryId: categoryId}).toArray()),
            TE.mapLeft(e => e ? e : DatabaseError.find)
        );
    }

    updateProduct(product: Product): TaskEither<Error, Product> {
        return pipe(
            TE.fromTask(() => this.collection.updateOne({_id: ObjectId.createFromHexString(product.id)}, {
                $set: {
                    name: product.name,
                    description: product.description,
                    imageBytes: product.imageBytes,
                    price: product.price,
                    discount: product.discount,
                    weight: product.weight,
                    quantity: product.quantity,
                    categoryId: product.categoryId,
                    tags: product.tags,
                    updatedAt: new Date().getTime()
                }
            })),
            TE.mapLeft(e => e ? e : DatabaseError.update),
            TE.chain(() =>
                TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(product.id)}))),
            TE.chain(TE.fromNullable(DatabaseError.findOne))
        );
    }

    removeProduct(id: string): TaskEither<Error, string> {
        return pipe(
            TE.fromTask(() => this.collection.deleteOne({_id: ObjectId.createFromHexString(id)})),
            TE.mapLeft(e => e ? e : DatabaseError.deleteOne),
            TE.map(() => id)
        );
    }
}