import {UseCase} from "../interactor/UseCase";
import {Order} from "./Order";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {OrderRepository} from "./OrderRepository";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {OrderError} from "./OrderError";

@injectable()
export class GetCustomerOrders extends UseCase<string, Order[]> {
    constructor(@inject(Types.order.repository) private readonly repository: OrderRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, Order[]> => pipe(
        this.repository.getOrdersByCustomerId(arg),
        TE.chain(TE.fromNullable(OrderError.NotFound))
    );
}