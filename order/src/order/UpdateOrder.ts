import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {OrderRepository} from "./OrderRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {Order} from "./Order";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {OrderError} from "./OrderError";

@injectable()
export class UpdateOrder extends UseCase<Order, Order> {
    constructor(@inject(Types.order.repository) private readonly repository: OrderRepository) {
        super();
    }

    execute = (arg: Order): TaskEither<Error, Order> => pipe(
        this.repository.updateOrder(arg),
        TE.chain(TE.fromNullable(OrderError.NotFound))
    );
}