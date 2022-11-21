import {Either} from "fp-ts/Either";
import {Exception} from "../exception/Exception";

export abstract class UseCase<T, R> {
    abstract execute(arg: T): Either<Exception, R>
}