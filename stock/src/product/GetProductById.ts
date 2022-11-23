import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Product} from "./Product";
import {Types} from "../di/types";
import {ProductRepository} from "./ProductRepository";
import {Either} from "fp-ts/Either";
import {Exception} from "../exception/Exception";

@injectable()
export class GetProductById extends UseCase<string, Product> {
    constructor(@inject(Types.product.repository) private readonly repository: ProductRepository) {
        super();
    }

    execute(arg: string): Either<Exception, Product> {
        return this.repository.getProductById(arg);
    }
}