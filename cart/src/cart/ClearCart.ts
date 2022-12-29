import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {CartRepository} from "./CartRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CartError} from "./CartError";

@injectable()
export class ClearCart extends UseCase<string, string> {
    constructor(@inject(Types.cart.repository) private readonly cartRepository: CartRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, string> => pipe(
        this.cartRepository.removeItemsByCartId(arg),
        TE.chain(TE.fromNullable(CartError.NotFound))
    );
}