import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {CartRepository} from "./CartRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class ClearCart extends UseCase<string, string> {
    constructor(@inject(Types.cart.repository) private readonly cartRepository: CartRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, string> {
        return this.cartRepository.removeItemsByCartId(arg);
    }
}