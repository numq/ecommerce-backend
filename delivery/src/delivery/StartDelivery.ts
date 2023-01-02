import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {DeliveryRepository} from "./DeliveryRepository";
import {UseCase} from "../interactor/UseCase";
import {Delivery} from "./Delivery";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {DeliveryError} from "./DeliveryError";

@injectable()
export class StartDelivery extends UseCase<Delivery, Delivery> {
    constructor(@inject(Types.delivery.repository) private readonly repository: DeliveryRepository) {
        super();
    }

    execute = (arg: Delivery): TaskEither<Error, Delivery> => pipe(
        this.repository.createDelivery(arg),
        TE.chain(TE.fromNullable(DeliveryError.NotFound)),
        TE.chain(this.repository.getDeliveryById),
        TE.chain(TE.fromNullable(DeliveryError.NotFound))
    );
}