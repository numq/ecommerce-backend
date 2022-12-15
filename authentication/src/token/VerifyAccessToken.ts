import {UseCase} from "../interactor/UseCase";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {TokenRepository} from "./TokenRepository";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";

@injectable()
export class VerifyAccessToken extends UseCase<string, string> {
    constructor(@inject(Types.token.repository) private readonly tokenRepository: TokenRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, string> {
        return pipe(
            this.tokenRepository.verifyToken(arg),
            TE.map(account => account.id)
        );
    }
}