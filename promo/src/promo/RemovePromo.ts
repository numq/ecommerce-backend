import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {PromoRepository} from "./PromoRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {PromoError} from "./PromoError";

@injectable()
export class RemovePromo extends UseCase<string, string> {
    constructor(@inject(Types.promo.repository) private readonly promoRepository: PromoRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, string> => pipe(
        this.promoRepository.removePromo(arg),
        TE.chain(TE.fromNullable(PromoError.NotFound))
    );
}