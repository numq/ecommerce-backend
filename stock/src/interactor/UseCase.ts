import {Either} from "fp-ts/Either";

export abstract class UseCase<T, R> {
    abstract execute(arg: T): Either<Error, R>
}