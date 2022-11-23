import {Module} from "./di/module";
import {Types} from "./di/types";
import {Server} from "./server/Server";
import * as dotenv from "dotenv";
import {ProductServiceServer, ProductServiceService} from "./generated/product";
import {CategoryServiceServer, CategoryServiceService} from "./generated/category";
import {Database} from "./database/Database";

(initialize => {
    initialize().then(() => {
        console.log("Successfully launched stock service.");
    }).catch(console.error);
})(async () => {
    dotenv.config();
    Module.initModules();
    await Module.container.get<Database>(Types.app.database).open();
    Module.container.get<Server>(Types.app.server).launch(server => {
        server.addService(CategoryServiceService, Module.container.get<CategoryServiceServer>(Types.category.service));
        server.addService(ProductServiceService, Module.container.get<ProductServiceServer>(Types.product.service));
    });
});