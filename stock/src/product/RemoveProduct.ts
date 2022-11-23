import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {ProductRepository} from "./ProductRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class RemoveProduct extends UseCase<string, string> {
    constructor(@inject(Types.product.repository) private readonly repository: ProductRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, string> {
        return this.repository.removeProduct(arg);
    }
}