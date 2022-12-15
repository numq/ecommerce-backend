import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {AccountRepository} from "../account/AccountRepository";
import {TokenRepository} from "../token/TokenRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {ConfirmationRepository} from "./ConfirmationRepository";
import {CredentialType} from "./CredentialType";
import {Role} from "../account/Role";

@injectable()
export class VerifyConfirmationCode extends UseCase<[string, CredentialType, Role, string], [string, string]> {
    constructor(
        @inject(Types.account.repository) private readonly accountRepository: AccountRepository,
        @inject(Types.confirmation.repository) private readonly confirmationRepository: ConfirmationRepository,
        @inject(Types.token.repository) private readonly tokenRepository: TokenRepository
    ) {
        super();
    }

    execute(arg: [string, CredentialType, Role, string]): TaskEither<Error, [string, string]> {
        const [credentials, credentialType, role, confirmationCode] = arg;
        return pipe(
            this.confirmationRepository.verifyConfirmationCode(credentials, credentialType, confirmationCode),
            TE.chain(this.accountRepository.getAccountByCredentialsOrNull),
            TE.chain(account => {
                if (!account) {
                    /**
                     * sign up
                     */
                    return pipe(
                        this.accountRepository.addAccount(credentials, credentialType, role),
                        TE.chain(this.accountRepository.getAccountByCredentials)
                    );
                } else {
                    /**
                     * sign in
                     */
                    return TE.right(account);
                }
            }),
            TE.chain(account => pipe(
                TE.Do,
                TE.bind("refreshToken", () => this.tokenRepository.generateRefreshToken(account)),
                TE.bind("accessToken", () => this.tokenRepository.generateAccessToken(account)),
                TE.map(({refreshToken, accessToken}) => [refreshToken, accessToken])
            ))
        );
    }
}