import * as dotenv from "dotenv";
import {Types} from "./di/types";
import {CartServiceServer, CartServiceService} from "./generated/cart";
import {Cache} from "./cache/Cache";
import {Module} from "./di/module";
import {Server} from "./server/Server";
import {createApplication} from "./app";


const initialize = async () => {
    dotenv.config();
    Module.initModules();
};

const execute = async () => {
    await Module.container.get<Cache>(Types.app.cache).open();
    await Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(CartServiceService, Module.container.get<CartServiceServer>(Types.cart.service));
    });
};

createApplication(initialize, execute);