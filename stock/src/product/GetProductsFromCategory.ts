import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Product} from "./Product";
import {Types} from "../di/types";
import {ProductRepository} from "./ProductRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class GetProductsFromCategory extends UseCase<[string, number, number], Product[]> {
    constructor(@inject(Types.product.repository) private readonly repository: ProductRepository) {
        super();
    }

    execute(arg: [string, number, number]): TaskEither<Error, Product[]> {
        return this.repository.getProductsFromCategory(...arg);
    }
}