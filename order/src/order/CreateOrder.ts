import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {OrderRepository} from "./OrderRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {Order} from "./Order";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {OrderError} from "./OrderError";

@injectable()
export class CreateOrder extends UseCase<Order, string> {
    constructor(@inject(Types.order.repository) private readonly repository: OrderRepository) {
        super();
    }

    execute = (arg: Order): TaskEither<Error, string> => pipe(
        this.repository.addOrder(arg),
        TE.chain(TE.fromNullable(OrderError.NotFound))
    );
}