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
export class GetDeliveryById extends UseCase<string, Delivery> {
    constructor(@inject(Types.delivery.repository) private readonly repository: DeliveryRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, Delivery> => pipe(
        this.repository.getDeliveryById(arg),
        TE.chain(TE.fromNullable(DeliveryError.NotFound))
    );
}