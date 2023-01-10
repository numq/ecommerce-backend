import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {Item} from "./Item";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CacheError} from "../store/StoreError";
import * as A from "fp-ts/Array"
import {Store} from "../store/Store";


export interface CartRepository {
    getItemsByCartId(cartId: string): TaskEither<Error, Item[]>

    getItemById(cartId: string, itemId: string): TaskEither<Error, Item | null>

    createItem(cartId: string, itemId: string): TaskEither<Error, string | null>

    updateItem(cartId: string, item: Item): TaskEither<Error, Item | null>

    removeItemById(cartId: string, itemId: string): TaskEither<Error, string | null>

    removeItemsByCartId(cartId: string): TaskEither<Error, string | null>
}

@injectable()
export class CartRepositoryImpl implements CartRepository {
    constructor(@inject(Types.app.store) private readonly store: Store) {
    }

    getItemById = (cartId: string, itemId: string): TaskEither<Error, Item | null> => pipe(
        this.store.client,
        TE.fromNullable(CacheError.client),
        TE.chain(client => TE.fromTask(() => client.hGet(cartId, itemId))),
        TE.chain(value => value ? TE.fromTask(JSON.parse(value)) : TE.of(null))
    );

    removeItemById = (cartId: string, itemId: string): TaskEither<Error, string | null> => pipe(
        this.store.client,
        TE.fromNullable(CacheError.client),
        TE.chain(client => TE.fromTask(() => client.hDel(cartId, itemId))),
        TE.map(count => count > 0 ? itemId : null)
    );

    createItem = (cartId: string, itemId: string): TaskEither<Error, string | null> => pipe(
        this.store.client,
        TE.fromNullable(CacheError.client),
        TE.chain(client => TE.fromTask(() => client.hSet(cartId, itemId, JSON.stringify({
            id: itemId,
            quantity: 1,
            addedAt: new Date().getTime()
        })))),
        TE.map(count => count > 0 ? itemId : null)
    );

    updateItem = (cartId: string, item: Item): TaskEither<Error, Item | null> => pipe(
        this.store.client,
        TE.fromNullable(CacheError.client),
        TE.chain(client => TE.fromTask(() => client.hSet(cartId, item.id, JSON.stringify({
            id: item.id,
            quantity: item.quantity,
            addedAt: item.addedAt
        })))),
        TE.map(count => count > 0 ? item : null)
    );

    getItemsByCartId = (cartId: string): TaskEither<Error, Item[]> => pipe(
        this.store.client,
        TE.fromNullable(CacheError.client),
        TE.chain(client => TE.fromTask(() => client.hGetAll(cartId))),
        TE.map(Object.entries),
        TE.map(A.map(([key, value]) => {
            const {quantity, addedAt} = JSON.parse(value);
            return ({
                id: key,
                quantity: Number(quantity),
                addedAt: addedAt
            });
        }))
    );

    removeItemsByCartId = (cartId: string): TaskEither<Error, string | null> => pipe(
        this.store.client,
        TE.fromNullable(CacheError.client),
        TE.chain(client => TE.fromTask(() => client.del(cartId))),
        TE.map(count => count > 0 ? cartId : null)
    );
}