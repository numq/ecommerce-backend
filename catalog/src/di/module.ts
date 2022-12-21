import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Collection} from "mongodb";
import {Database} from "../database/Database";
import {RemoveCatalogItem} from "../catalog/RemoveCatalogItem";
import {UpdateCatalogItem} from "../catalog/UpdateCatalogItem";
import {GetCatalogItemsByCategory} from "../catalog/GetCatalogItemsByCategory";
import {GetCatalogItemById} from "../catalog/GetCatalogItemById";
import {AddCatalogItem} from "../catalog/AddCatalogItem";
import {CatalogRepository, CatalogRepositoryImpl} from "../catalog/CatalogRepository";
import {CatalogServiceServer} from "../generated/catalog";
import {CatalogService} from "../catalog/CatalogService";
import {GetCatalogItemsByTag} from "../catalog/GetCatalogItemsByTag";
import {CatalogItem} from "../catalog/CatalogItem";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, catalog].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const catalog = new ContainerModule(bind => {
        bind<Collection<CatalogItem>>(Types.catalog.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<CatalogItem>(container.get<Config>(Types.app.config).COLLECTION_ITEMS!)!;
        }).inSingletonScope();
        bind<CatalogServiceServer>(Types.catalog.service).to(CatalogService).inSingletonScope();
        bind<CatalogRepository>(Types.catalog.repository).to(CatalogRepositoryImpl).inSingletonScope();
        bind<AddCatalogItem>(Types.catalog.addCatalogItem).to(AddCatalogItem).inTransientScope();
        bind<GetCatalogItemById>(Types.catalog.getCatalogItemById).to(GetCatalogItemById).inTransientScope();
        bind<GetCatalogItemsByCategory>(Types.catalog.getCatalogItemsByCategory).to(GetCatalogItemsByCategory).inTransientScope();
        bind<GetCatalogItemsByTag>(Types.catalog.getCatalogItemsByTag).to(GetCatalogItemsByTag).inTransientScope();
        bind<UpdateCatalogItem>(Types.catalog.updateCatalogItem).to(UpdateCatalogItem).inTransientScope();
        bind<RemoveCatalogItem>(Types.catalog.removeCatalogItem).to(RemoveCatalogItem).inTransientScope();
    });
}