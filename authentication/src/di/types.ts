export namespace Types {
    export const app = {
        config: Symbol.for("appConfig"),
        cache: Symbol.for("appCache"),
        database: Symbol.for("appDatabase"),
        server: Symbol.for("appServer")
    };
    export const confirmation = {
        service: Symbol.for("confirmationService"),
        repository: Symbol.for("confirmationRepository"),
        sendCredentials: Symbol.for("sendCredentials"),
        verifyConfirmationCode: Symbol.for("verifyConfirmationCode")
    };
    export const account = {
        collection: Symbol.for("accountCollection"),
        repository: Symbol.for("accountRepository")
    };
    export const token = {
        collection: Symbol.for("tokenCollection"),
        service: Symbol.for("tokenService"),
        repository: Symbol.for("tokenRepository"),
        verifyAccessToken: Symbol.for("verifyAccessToken")
    };
}