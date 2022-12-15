import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {TokenRepository} from "./TokenRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";

@injectable()
export class RefreshAccessToken extends UseCase<string, [string, string]> {
    constructor(@inject(Types.token.repository) private readonly tokenRepository: TokenRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, [string, string]> {
        return pipe(
            this.tokenRepository.verifyToken(arg),
            TE.bindTo("account"),
            TE.bind("refreshToken", ({account}) => this.tokenRepository.generateRefreshToken(account)),
            TE.bind("accessToken", ({account}) => this.tokenRepository.generateAccessToken(account)),
            TE.map(({refreshToken, accessToken}) => [refreshToken, accessToken])
        );
    }
}