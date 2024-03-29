import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Delivery} from "./Delivery";
import {Types} from "../di/types";
import {DeliveryRepository} from "./DeliveryRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {DeliveryError} from "./DeliveryError";
import {taskEither as TE} from "fp-ts";

@injectable()
export class GetDeliveriesByCourierId extends UseCase<[string, number, number], Delivery[]> {
    constructor(@inject(Types.delivery.repository) private readonly repository: DeliveryRepository) {
        super();
    }

    execute = (arg: [string, number, number]): TaskEither<Error, Delivery[]> => pipe(
        this.repository.getDeliveriesByCourierId(...arg),
        TE.chain(TE.fromNullable(DeliveryError.NotFound))
    );
}