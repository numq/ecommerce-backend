import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Delivery} from "./Delivery";
import {Types} from "../di/types";
import {DeliveryRepository} from "./DeliveryRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class GetDeliveriesByCourierId extends UseCase<[string, number, number], Delivery[]> {
    constructor(@inject(Types.delivery.repository) private readonly repository: DeliveryRepository) {
        super();
    }

    execute = (arg: [string, number, number]): TaskEither<Error, Delivery[]> => this.repository.getDeliveriesByCourierId(...arg)
}