import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Item} from "./Item";
import {CartRepository} from "./CartRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {Types} from "../di/types";

@injectable()
export class GetCart extends UseCase<string, Item[]> {
    constructor(@inject(Types.cart.repository) private readonly cartRepository: CartRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, Item[]> {
        return this.cartRepository.getItemsByCartId(arg);
    }
}