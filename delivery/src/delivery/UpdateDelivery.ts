import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Delivery} from "./Delivery";
import {Types} from "../di/types";
import {DeliveryRepository} from "./DeliveryRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {DeliveryError} from "./DeliveryError";

@injectable()
export class UpdateDelivery extends UseCase<Delivery, Delivery> {
    constructor(@inject(Types.delivery.repository) private readonly repository: DeliveryRepository) {
        super();
    }

    execute = (arg: Delivery): TaskEither<Error, Delivery> => pipe(
        this.repository.updateDelivery(arg),
        TE.chain(TE.fromNullable(DeliveryError.NotFound))
    );
}