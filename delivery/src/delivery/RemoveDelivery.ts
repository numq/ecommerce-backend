import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {DeliveryRepository} from "./DeliveryRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {DeliveryError} from "./DeliveryError";

@injectable()
export class RemoveDelivery extends UseCase<string, string> {
    constructor(@inject(Types.delivery.repository) private readonly repository: DeliveryRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, string> => pipe(
        this.repository.removeDelivery(arg),
        TE.chain(TE.fromNullable(DeliveryError.NotFound))
    );
}