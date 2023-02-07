import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Promo} from "./Promo";
import {Types} from "../di/types";
import {PromoRepository} from "./PromoRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {PromoError} from "./PromoError";

@injectable()
export class GetPromo extends UseCase<string, Promo> {
    constructor(@inject(Types.promo.repository) private readonly promoRepository: PromoRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, Promo> => pipe(
        this.promoRepository.getPromo(arg),
        TE.chain(TE.fromNullable(PromoError.NotFound))
    );
}