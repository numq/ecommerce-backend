import {TaskEither} from "fp-ts/TaskEither";
import {either as E} from "fp-ts";
import {pipe} from "fp-ts/function";
import {Either} from "fp-ts/Either";
import {ResponseError} from "./ResponseError";

export const response = <T, R>(input: TaskEither<Error, T>, callback: (e: Error | null, r: R | null) => void, map: (t: T) => R): void => {
    input().then((either: Either<Error, T>) => pipe(either,
        E.chain((value: T) => E.tryCatch(() => map(value), e => e instanceof Error ? e : ResponseError.map)),
        E.fold((e: Error) => {
                console.error(e);
                callback(e, null);
            }, (value: R) => {
                callback(null, value);
            }
        )
    )).catch((e: Error) => {
        console.error(e);
        callback(e, null);
    });
};