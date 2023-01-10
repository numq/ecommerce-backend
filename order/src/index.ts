import {Module} from "./di/module";
import {Types} from "./di/types";
import {Server} from "./server/Server";
import * as dotenv from "dotenv";
import {Database} from "./database/Database";
import {createApplication} from "./app";
import {OrderServiceServer, OrderServiceService} from "./generated/order";

const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    await Module.container.get<Database>(Types.app.database).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(OrderServiceService, Module.container.get<OrderServiceServer>(Types.order.service));
    });
};

createApplication(initialize, execute);