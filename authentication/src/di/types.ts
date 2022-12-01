export namespace Types {
    export const app = {
        config: Symbol.for("appConfig"),
        database: Symbol.for("appDatabase"),
        server: Symbol.for("appServer")
    };
    export const account = {
        collection: Symbol.for("accountCollection"),
        repository: Symbol.for("accountRepository"),
        service: Symbol.for("accountService"),
        authenticate: Symbol.for("authenticate")
    };
    export const confirmation = {
        service: Symbol.for("confirmationService")
    };
    export const token = {
        service: Symbol.for("tokenService"),
        repository: Symbol.for("tokenRepository"),
        verifyToken: Symbol.for("verifyToken")
    };
}