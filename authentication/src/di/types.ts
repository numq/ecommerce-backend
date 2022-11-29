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
        accessAccount: Symbol.for("accessAccount"),
        verifyAccount: Symbol.for("verifyAccount")
    };
}