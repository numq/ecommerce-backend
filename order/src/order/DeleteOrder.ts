import {UseCase} from "../interactor/UseCase";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {OrderRepository} from "./OrderRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {taskEither as TE} from "fp-ts";
import {OrderError} from "./OrderError";
import {pipe} from "fp-ts/function";

@injectable()
export class DeleteOrder extends UseCase<string, string> {
    constructor(@inject(Types.order.repository) private readonly repository: OrderRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, string> => pipe(
        this.repository.removeOrder(arg),
        TE.chain(TE.fromNullable(OrderError.NotFound))
    );
}