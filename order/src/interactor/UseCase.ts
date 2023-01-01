import {TaskEither} from "fp-ts/TaskEither";

export abstract class UseCase<T, R> {
    abstract execute(arg: T): TaskEither<Error, R>
}