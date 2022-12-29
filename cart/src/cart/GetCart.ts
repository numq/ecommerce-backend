import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Item} from "./Item";
import {CartRepository} from "./CartRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {Types} from "../di/types";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CartError} from "./CartError";

@injectable()
export class GetCart extends UseCase<string, Item[]> {
    constructor(@inject(Types.cart.repository) private readonly cartRepository: CartRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, Item[]> => pipe(
        this.cartRepository.getItemsByCartId(arg),
        TE.chain(TE.fromNullable(CartError.NotFound))
    );
}