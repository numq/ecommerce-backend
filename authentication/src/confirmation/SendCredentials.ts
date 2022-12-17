import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {ConfirmationRepository} from "./ConfirmationRepository";
import {CredentialType} from "../account/CredentialType";

@injectable()
export class SendCredentials extends UseCase<[string, CredentialType], number> {
    constructor(
        @inject(Types.confirmation.repository) private readonly confirmationRepository: ConfirmationRepository
    ) {
        super();
    }

    execute(arg: [string, CredentialType]): TaskEither<Error, number> {
        const [credentials, credentialType] = arg;
        return this.confirmationRepository.sendConfirmationCode(credentials, credentialType);
    }
}