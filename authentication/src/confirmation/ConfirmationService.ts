import {inject, injectable} from "inversify";
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from "@grpc/grpc-js";
import {Types} from "../di/types";
import {SendCredentials} from "./SendCredentials";
import {VerifyConfirmationCode} from "./VerifyConfirmationCode";
import {response} from "../response";
import {CredentialType} from "../account/CredentialType";
import {
    ConfirmationServiceServer,
    SendCredentialsRequest,
    SendCredentialsResponse,
    VerifyConfirmationCodeRequest,
    VerifyConfirmationCodeResponse
} from "../generated/confirmation";

@injectable()
export class ConfirmationService implements ConfirmationServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.confirmation.sendCredentials) private readonly sendCredentialsUseCase: SendCredentials,
        @inject(Types.confirmation.verifyConfirmationCode) private readonly verifyConfirmationCodeUseCase: VerifyConfirmationCode
    ) {
    }

    sendCredentials = (call: ServerUnaryCall<SendCredentialsRequest, SendCredentialsResponse>, callback: sendUnaryData<SendCredentialsResponse>) => {
        const {credentials, credentialType} = call.request;
        response(this.sendCredentialsUseCase.execute([credentials, credentialType as CredentialType]), callback, value => ({retryTimeout: value}));
    }

    verifyConfirmationCode = (call: ServerUnaryCall<VerifyConfirmationCodeRequest, VerifyConfirmationCodeResponse>, callback: sendUnaryData<VerifyConfirmationCodeResponse>) => {
        const {credentials, credentialType, confirmationCode} = call.request;
        response(this.verifyConfirmationCodeUseCase.execute([credentials, credentialType as CredentialType, confirmationCode]), callback, ([refreshToken, accessToken]) => ({
            refreshToken: refreshToken,
            accessToken: accessToken
        }));
    }
}