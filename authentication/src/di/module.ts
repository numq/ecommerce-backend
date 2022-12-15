import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Cache} from "../cache/Cache";
import {Database} from "../database/Database";
import {Server} from "../server/Server";
import {Collection} from "mongodb";
import {Account} from "../account/Account";
import {AccountRepository, AccountRepositoryImpl} from "../account/AccountRepository";
import {ConfirmationServiceServer} from "../generated/confirmation";
import {ConfirmationService} from "../confirmation/ConfirmationService";
import {ConfirmationRepository, ConfirmationRepositoryImpl} from "../confirmation/ConfirmationRepository";
import {SendCredentials} from "../confirmation/SendCredentials";
import {VerifyConfirmationCode} from "../confirmation/VerifyConfirmationCode";
import {TokenServiceServer} from "../generated/token";
import {TokenService} from "../token/TokenService";
import {TokenRepository, TokenRepositoryImpl} from "../token/TokenRepository";
import {VerifyAccessToken} from "../token/VerifyAccessToken";
import {RefreshToken} from "../token/RefreshToken";
import {RefreshAccessToken} from "../token/RefreshAccessToken";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, account, confirmation, token].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Cache>(Types.app.cache).to(Cache).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });
    const account = new ContainerModule(bind => {
        bind<Collection<Account>>(Types.account.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<Account>(container.get<Config>(Types.app.config).COLLECTION_ACCOUNTS!)!;
        }).inSingletonScope();
        bind<AccountRepository>(Types.account.repository).to(AccountRepositoryImpl).inSingletonScope();
    });
    const confirmation = new ContainerModule(bind => {
        bind<ConfirmationServiceServer>(Types.confirmation.service).to(ConfirmationService).inSingletonScope();
        bind<ConfirmationRepository>(Types.confirmation.repository).to(ConfirmationRepositoryImpl).inSingletonScope();
        bind<SendCredentials>(Types.confirmation.sendCredentials).to(SendCredentials).inTransientScope();
        bind<VerifyConfirmationCode>(Types.confirmation.verifyConfirmationCode).to(VerifyConfirmationCode).inTransientScope();
    });
    const token = new ContainerModule(bind => {
        bind<Collection<RefreshToken>>(Types.token.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<RefreshToken>(container.get<Config>(Types.app.config).COLLECTION_TOKENS!)!;
        }).inSingletonScope();
        bind<TokenServiceServer>(Types.token.service).to(TokenService).inSingletonScope();
        bind<TokenRepository>(Types.token.repository).to(TokenRepositoryImpl).inSingletonScope();
        bind<VerifyAccessToken>(Types.token.verifyAccessToken).to(VerifyAccessToken).inTransientScope();
        bind<RefreshAccessToken>(Types.token.refreshAccessToken).to(RefreshAccessToken).inTransientScope();
    });
}