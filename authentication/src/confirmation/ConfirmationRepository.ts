import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {ConfirmationError} from "./ConfirmationError";
import {Cache} from "../cache/Cache";
import {CacheError} from "../cache/CacheError";
import {CredentialType} from "../account/CredentialType";

export interface ConfirmationRepository {
    sendConfirmationCode(credentials: string, credentialType: CredentialType): TaskEither<Error, number>

    verifyConfirmationCode(credentials: string, credentialType: CredentialType, confirmationCode: string): TaskEither<Error, string>
}

@injectable()
export class ConfirmationRepositoryImpl implements ConfirmationRepository {
    constructor(
        @inject(Types.app.cache) private readonly cache: Cache
    ) {
    }

    sendConfirmationCode = (credentials: string, credentialType: CredentialType): TaskEither<Error, number> => {
        /**
         * sending confirmation code using some external service by credential type
         */
        return pipe(
            TE.fromTask(() => Promise.resolve("0000")),
            TE.mapLeft(() => ConfirmationError.sendConfirmationCode),
            TE.chain(confirmationCode => pipe(
                this.cache.client,
                TE.fromNullable(CacheError.client),
                TE.chain(client => TE.tryCatch(() => client.set(credentials, confirmationCode), () => CacheError.create))
            )),
            TE.map(() => 60000)
        );
    }

    verifyConfirmationCode = (credentials: string, credentialType: CredentialType, confirmationCode: string): TaskEither<Error, string> => {
        return pipe(
            this.cache.client,
            TE.fromNullable(CacheError.client),
            TE.chain(client => TE.tryCatch(() => client.get(credentials), () => CacheError.get)),
            TE.chain(code => {
                if (code == confirmationCode) {
                    return TE.right(credentials);
                } else {
                    return TE.left(ConfirmationError.verifyConfirmationCode);
                }
            })
        );
    }
}