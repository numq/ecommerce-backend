import {Module} from "./di/module";
import {Types} from "./di/types";
import {Server} from "./server/Server";
import * as dotenv from "dotenv";
import {CatalogServiceServer, CatalogServiceService} from "./generated/catalog";
import {Database} from "./database/Database";
import {createApplication} from "./app";
import {MessageQueue} from "./amqp/MessageQueue";
import {Config} from "./config/Config";

const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    const messageQueue = Module.container.get<MessageQueue>(Types.app.messageQueue);
    await messageQueue.connect();
    await messageQueue.openChannel(Module.container.get<Config>(Types.app.config).AMQP_CHANNEL_CATALOG!!)!!;
    await Module.container.get<Database>(Types.app.database).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(CatalogServiceService, Module.container.get<CatalogServiceServer>(Types.catalog.service));
    });
};

createApplication(initialize, execute);