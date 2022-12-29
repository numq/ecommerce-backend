import {TaskEither} from "fp-ts/TaskEither";
import {flow} from "fp-ts/function";
import {either as E} from "fp-ts";
import {ResponseError} from "./ResponseError";

export const response = <T, R>(input: TaskEither<Error, T>, callback: (e: Error | null, r: R | null) => void, map: (t: T) => R): void => {
    input().then(flow(E.chain((t: T) => E.tryCatch(() => map(t), () => ResponseError.map)), E.fold((e: Error) => callback(e, null), (r: R) => callback(null, r)))).catch(e => callback(e, null));
}