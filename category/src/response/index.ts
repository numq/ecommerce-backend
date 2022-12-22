import {TaskEither} from "fp-ts/TaskEither";
import {taskEither as TE} from "fp-ts";
import {pipe} from "fp-ts/function";
import {ResponseError} from "./ResponseError";

export const response = <T, R>(input: TaskEither<Error, T>, callback: (e: Error | null, r: R | null) => void, map: (t: T) => R) => pipe(
    input,
    TE.chain((t: T) => TE.tryCatch(() => Promise.resolve(map(t)), () => ResponseError.map)),
    TE.bimap((e: Error) => callback(e, null), (r: R) => callback(null, r))
)();