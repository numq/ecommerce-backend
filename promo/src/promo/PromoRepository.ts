import {Promo} from "./Promo";
import {TaskEither} from "fp-ts/TaskEither";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {Store} from "../store/Store";
import {StoreError} from "../store/StoreError";
import {PromoError} from "./PromoError";

export interface PromoRepository {
    insertPromo(promo: Promo): TaskEither<Error, Promo>

    getPromo(value: string): TaskEither<Error, Promo>

    removePromo(value: string): TaskEither<Error, string>
}

@injectable()
export class PromoRepositoryImpl implements PromoRepository {
    constructor(@inject(Types.app.store) private readonly store: Store) {
    }

    insertPromo = (promo: Promo): TaskEither<Error, Promo> => pipe(
        this.store.client,
        TE.fromNullable(StoreError.client),
        TE.chain(client => TE.fromTask(() => client.set(promo.value, JSON.stringify(promo), {PX: promo.expirationTime - new Date().getMilliseconds()}))),
        TE.chain(result => result == 'OK' ? TE.right(promo) : TE.left(PromoError.InsertionFailed))
    );

    getPromo = (value: string): TaskEither<Error, Promo> => pipe(
        this.store.client,
        TE.fromNullable(StoreError.client),
        TE.chain(client => TE.fromTask(() => client.get(value))),
        TE.chain(result => result ? TE.right(JSON.parse(result)) : TE.left(PromoError.NotFound))
    );

    removePromo = (value: string): TaskEither<Error, string> => pipe(
        this.store.client,
        TE.fromNullable(StoreError.client),
        TE.chain(client => TE.fromTask(() => client.del(value))),
        TE.chain(count => count > 0 ? TE.right(value) : TE.left(PromoError.RemovalFailed))
    );
}