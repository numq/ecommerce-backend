import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {CartRepository} from "./CartRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {Types} from "../di/types";
import {Item} from "./Item";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CartError} from "./CartError";

@injectable()
export class IncreaseItemQuantity extends UseCase<[string, string], Item> {
    constructor(@inject(Types.cart.repository) private readonly cartRepository: CartRepository) {
        super();
    }

    execute = (arg: [string, string]): TaskEither<Error, Item> => pipe(
        TE.Do,
        TE.map(() => arg),
        TE.bind("cartId", ([cartId, _]) => TE.of(cartId)),
        TE.bind("itemId", ([_, itemId]) => TE.of(itemId)),
        TE.chain(({cartId, itemId}) => pipe(
                this.cartRepository.getItemById(cartId, itemId),
                TE.chain(TE.fromNullable(CartError.NotFound)),
                TE.chain(item => item ? pipe(
                        this.cartRepository.updateItem(cartId, ({
                            id: item.id,
                            quantity: item.quantity + 1,
                            addedAt: item.addedAt
                        }))
                    ) : pipe(
                        this.cartRepository.createItem(cartId, itemId),
                        TE.chain(() => this.cartRepository.getItemById(cartId, itemId))
                    )
                ),
                TE.chain(TE.fromNullable(CartError.NotFound))
            )
        )
    );
}