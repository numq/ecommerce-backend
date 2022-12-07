import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {Item} from "./Item";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CacheError} from "../cache/CacheError";
import {Cache} from "../cache/Cache";
import * as A from "fp-ts/Array"


export interface CartRepository {
    getItemsByCartId(cartId: string): TaskEither<Error, Item[]>

    getItemById(cartId: string, itemId: string): TaskEither<Error, Item>

    getItemByIdOrNull(cartId: string, itemId: string): TaskEither<Error, Item | null>

    createItem(cartId: string, itemId: string): TaskEither<Error, number>

    updateItem(cartId: string, item: Item): TaskEither<Error, number>

    removeItemById(cartId: string, itemId: string): TaskEither<Error, number>

    removeItemsByCartId(cartId: string): TaskEither<Error, string>
}

@injectable()
export class CartRepositoryImpl implements CartRepository {
    constructor(@inject(Types.app.cache) private readonly cache: Cache) {
    }

    getItemById(cartId: string, itemId: string): TaskEither<Error, Item> {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.hGet(cartId, itemId), () => CacheError.get)),
            TE.chain(TE.fromNullable(CacheError.get)),
            TE.map(JSON.parse),
            TE.map(({quantity, addedAt}) => ({
                id: itemId,
                quantity: quantity,
                addedAt: addedAt
            }))
        );
    }

    getItemByIdOrNull(cartId: string, itemId: string): TaskEither<Error, Item | null> {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.hGet(cartId, itemId), () => CacheError.get)),
            TE.chain(_ => _ ? pipe(
                TE.of(_),
                TE.map(JSON.parse),
                TE.map(({quantity, addedAt}) => ({
                    id: itemId,
                    quantity: quantity,
                    addedAt: addedAt
                }))
            ) : TE.right(null))
        );
    }


    removeItemById(cartId: string, itemId: string): TaskEither<Error, number> {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.hDel(cartId, itemId), () => CacheError.remove))
        );
    }

    createItem(cartId: string, itemId: string): TaskEither<Error, number> {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.hSet(cartId, itemId, JSON.stringify({
                id: itemId,
                quantity: 1,
                addedAt: new Date().getTime()
            })), () => CacheError.create))
        );
    }

    updateItem(cartId: string, item: Item): TaskEither<Error, number> {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.hSet(cartId, item.id, JSON.stringify({
                id: item.id,
                quantity: item.quantity,
                addedAt: item.addedAt
            })), () => CacheError.update))
        );
    }

    getItemsByCartId(cartId: string): TaskEither<Error, Item[]> {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.hGetAll(cartId), () => CacheError.getAll)),
            TE.map(Object.entries),
            TE.map(A.map(([key, value]) => {
                const {quantity, addedAt} = JSON.parse(value);
                return {
                    id: key,
                    quantity: Number(quantity),
                    addedAt: addedAt
                };
            }))
        );
    }

    removeItemsByCartId(cartId: string): TaskEither<Error, string> {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.del(cartId), () => CacheError.removeAll)),
            TE.map(() => cartId)
        );
    }
}