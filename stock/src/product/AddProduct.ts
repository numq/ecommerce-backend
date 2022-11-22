import {inject, injectable} from "inversify";
import {ProductRepository} from "./ProductRepository";
import {UseCase} from "../interactor/UseCase";
import {Product} from "./Product";
import {Either} from "fp-ts/lib/Either";
import {Types} from "../di/types";
import {Exception} from "../exception/Exception";

@injectable()
export class AddProduct extends UseCase<Product, string> {
    constructor(@inject(Types.product.repository) private readonly repository: ProductRepository) {
        super();
    }

    execute(arg: Product): Either<Exception, string> {
        return this.repository.addProduct(arg);
    }
}