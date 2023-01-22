import {Module} from "./di/module";
import {Types} from "./di/types";
import {Server} from "./server/Server";
import * as dotenv from "dotenv";
import {CategoryServiceServer, CategoryServiceService} from "./generated/category";
import {Database} from "./database/Database";
import {createApplication} from "./app";

const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    await Module.container.get<Database>(Types.app.database).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(CategoryServiceService, Module.container.get<CategoryServiceServer>(Types.category.service));
    });
};

createApplication(initialize, execute);