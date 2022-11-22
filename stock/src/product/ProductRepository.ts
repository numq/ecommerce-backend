import {Either} from "fp-ts/Either";
import {Exception} from "../exception/Exception";
import {Product} from "./Product";
import {inject, injectable} from "inversify";
import {Collection} from "mongodb";
import {Types} from "../di/types";
import {wrap} from "../wrapper/Promise";
import {either} from "fp-ts";
import {pipe} from "fp-ts/function";
import {ProductException} from "./ProductException";

export interface ProductRepository {
    addProduct(product: Product): Either<Exception, string>

    getProductById(id: string): Either<Exception, Product>

    getProductsFromCategory(categoryId: string, skip: number, limit: number): Either<Exception, Product[]>

    updateProduct(product: Product): Either<Exception, Product>

    removeProduct(id: string): Either<Exception, string>
}

@injectable()
export class ProductRepositoryImpl implements ProductRepository {
    constructor(@inject(Types.product.collection) private readonly collection: Collection<Product>) {
    }

    addProduct(product: Product): Either<Exception, string> {
        return pipe(
            wrap(this.collection.insertOne(product), ProductException.insert),
            either.map(x => x.insertedId.toHexString())
        );
    }

    getProductById(id: string): Either<Exception, Product> {
        return pipe(
            wrap(this.collection.findOne({id: id}), ProductException.getById),
            either.chain(either.fromNullable(ProductException.getById))
        );
    }

    getProductsFromCategory(categoryId: string, skip: number, limit: number): Either<Exception, Product[]> {
        return wrap(this.collection.find({categoryId: categoryId}).toArray(), ProductException.getFromCategory);
    }

    updateProduct(product: Product): Either<Exception, Product> {
        return pipe(
            wrap(this.collection.updateOne({id: product.id}, {
                name: product.name,
                description: product.description,
                imageBytes: product.imageBytes,
                price: product.price,
                discount: product.discount,
                weight: product.weight,
                quantity: product.quantity,
                categoryId: product.categoryId,
                tags: product.tags
            }), ProductException.update),
            either.chain(_ => wrap(this.collection.findOne({id: product.id}), ProductException.getById)),
            either.chain(either.fromNullable(ProductException.getById))
        );
    }

    removeProduct(id: string): Either<Exception, string> {
        return pipe(
            wrap(this.collection.deleteOne({id: id}), ProductException.remove),
            either.map(_ => id)
        );
    }
}