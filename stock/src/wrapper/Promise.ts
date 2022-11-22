import {Exception} from "../exception/Exception";
import {Either} from "fp-ts/Either";
import {either} from "fp-ts";

export const wrap = <T extends NonNullable<any>>(promise: Promise<T>, exception: Exception): Either<Exception, T> => {
    let result: Either<Exception, T> = either.left(exception);
    either.right(promise.then(value => {
        if (value) result = either.right(value);
    }).catch(e => {
        result = either.left(new Exception(e.message));
    }));
    return result;
}
