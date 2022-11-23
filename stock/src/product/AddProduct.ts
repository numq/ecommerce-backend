import {inject, injectable} from "inversify";
import {ProductRepository} from "./ProductRepository";
import {UseCase} from "../interactor/UseCase";
import {Product} from "./Product";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class AddProduct extends UseCase<Product, string> {
    constructor(@inject(Types.product.repository) private readonly repository: ProductRepository) {
        super();
    }

    execute(arg: Product): TaskEither<Error, string> {
        return this.repository.addProduct(arg);
    }
}