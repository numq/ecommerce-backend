import {Module} from "./di/module";
import {Types} from "./di/types";
import {Server} from "./server/Server";
import * as dotenv from "dotenv";
import {DeliveryServiceServer, DeliveryServiceService} from "./generated/delivery";
import {Database} from "./database/Database";
import {createApplication} from "./app/index.js";

const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    await Module.container.get<Database>(Types.app.database).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(DeliveryServiceService, Module.container.get<DeliveryServiceServer>(Types.delivery.service));
    });
};

createApplication(initialize, execute);