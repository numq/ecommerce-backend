import {Module} from "./di/module";
import {Types} from "./di/types";
import {Server} from "./server/Server";
import * as dotenv from "dotenv";
import {Database} from "./database/Database";
import {createApplication} from "./app";
import {TokenService} from "./token/TokenService";
import {ConfirmationService} from "./confirmation/ConfirmationService";
import {Cache} from "./cache/Cache";
import {ConfirmationServiceService} from "./generated/confirmation";
import {TokenServiceService} from "./generated/token";

const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    await Module.container.get<Cache>(Types.app.cache).open();
    await Module.container.get<Database>(Types.app.database).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(ConfirmationServiceService, Module.container.get<ConfirmationService>(Types.confirmation.service));
        server.addService(TokenServiceService, Module.container.get<TokenService>(Types.token.service));
    });
};

createApplication(initialize, execute);