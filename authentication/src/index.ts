import {Module} from "./di/module";
import {Types} from "./di/types";
import {Server} from "./server/Server";
import * as dotenv from "dotenv";
import {Database} from "./database/Database";
import {createApplication} from "./app";
import {AccountServiceService} from "./generated/account";
import {AccountService} from "./account/AccountService";
import {TokenServiceService} from "./generated/token";
import {TokenService} from "./token/TokenService";

const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    await Module.container.get<Database>(Types.app.database).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(AccountServiceService, Module.container.get<AccountService>(Types.account.service));
        server.addService(TokenServiceService, Module.container.get<TokenService>(Types.token.service));
    });
};

createApplication(initialize, execute);