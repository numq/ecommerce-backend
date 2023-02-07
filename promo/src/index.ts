import * as dotenv from "dotenv";
import {Store} from "./store/Store";
import {Server} from "./server/Server";
import {Types} from "./di/types";
import {Module} from "./di/module";
import {PromoServiceServer, PromoServiceService} from "./generated/promo";
import {createApplication} from "./application";

const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    await Module.container.get<Store>(Types.app.store).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(PromoServiceService, Module.container.get<PromoServiceServer>(Types.promo.service));
    });
};

createApplication(initialize, execute);