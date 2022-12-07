import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {CartRepository} from "./CartRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {Types} from "../di/types";
import {Item} from "./Item";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";

@injectable()
export class DecreaseItemQuantity extends UseCase<[string, string], Item | null> {
    constructor(@inject(Types.cart.repository) private readonly cartRepository: CartRepository) {
        super();
    }

    execute(arg: [string, string]): TaskEither<Error, Item | null> {
        const [cartId, itemId] = arg;
        return pipe(
            this.cartRepository.getItemById(cartId, itemId),
            TE.chain(item => {
                if (item.quantity > 1) {
                    return this.cartRepository.updateItem(cartId, ({
                        id: item.id,
                        quantity: item.quantity - 1,
                        addedAt: item.addedAt
                    }));
                } else {
                    return this.cartRepository.removeItemById(cartId, itemId);
                }
            }),
            TE.chain(() => this.cartRepository.getItemByIdOrNull(cartId, itemId))
        );
    }
}