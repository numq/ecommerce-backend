import {inject, injectable} from "inversify";
import {Promo} from "./Promo";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {UseCase} from "../interactor/UseCase";
import {PromoRepository} from "./PromoRepository";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {PromoError} from "./PromoError";


@injectable()
export class InsertPromo extends UseCase<[string, boolean, number, string[], string[], boolean, number], Promo> {
    constructor(@inject(Types.promo.repository) private readonly promoRepository: PromoRepository) {
        super();
    }

    execute = (arg: [string, boolean, number, string[], string[], boolean, number]): TaskEither<Error, Promo> => pipe(
        TE.Do,
        TE.map(() => arg),
        TE.bind("promo", ([value, reusable, requiredAmount, categoryIds, productIds, freeShipping, expirationTime]) => TE.of({
            value: value,
            reusable: reusable ? reusable : false,
            requiredAmount: requiredAmount ? requiredAmount : 0,
            categoryIds: categoryIds ? categoryIds : [],
            productIds: productIds ? productIds : [],
            freeShipping: freeShipping ? freeShipping : false,
            expirationTime: expirationTime
        })),
        TE.chain(({promo}) => this.promoRepository.insertPromo(promo)),
        TE.chain(TE.fromNullable(PromoError.NotFound))
    );
}