import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {ProductRepository} from "./ProductRepository";
import {Either} from "fp-ts/Either";
import {Exception} from "../exception/Exception";

@injectable()
export class RemoveProduct extends UseCase<string, string> {
    constructor(@inject(Types.product.repository) private readonly repository: ProductRepository) {
        super();
    }

    execute(arg: string): Either<Exception, string> {
        return this.repository.removeProduct(arg);
    }
}