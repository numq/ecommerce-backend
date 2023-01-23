import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Collection} from "mongodb";
import {Database} from "../database/Database";
import {RemoveCatalogItem} from "../catalog/RemoveCatalogItem";
import {UpdateCatalogItem} from "../catalog/UpdateCatalogItem";
import {GetCatalogItemById} from "../catalog/GetCatalogItemById";
import {AddCatalogItem} from "../catalog/AddCatalogItem";
import {CatalogRepository, CatalogRepositoryImpl} from "../catalog/CatalogRepository";
import {CatalogServiceServer} from "../generated/catalog";
import {CatalogService} from "../catalog/CatalogService";
import {GetCatalogItemsByTags} from "../catalog/GetCatalogItemsByTags";
import {CatalogItem} from "../catalog/CatalogItem";
import {MessageQueue} from "../amqp/MessageQueue";
import {Channel} from "amqplib";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, catalog].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope().onDeactivation(db => db.close());
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
        bind<MessageQueue>(Types.app.messageQueue).to(MessageQueue).inSingletonScope();
    });

    const catalog = new ContainerModule(bind => {
        bind<Channel>(Types.catalog.channel).toDynamicValue(() => {
            return container.get<MessageQueue>(Types.app.messageQueue).useChannel(container.get<Config>(Types.app.config).AMQP_CHANNEL_CATALOG!!)!!;
        }).inSingletonScope();
        bind<Collection<CatalogItem>>(Types.catalog.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<CatalogItem>(container.get<Config>(Types.app.config).COLLECTION_ITEMS!)!;
        }).inSingletonScope();
        bind<CatalogServiceServer>(Types.catalog.service).to(CatalogService).inSingletonScope();
        bind<CatalogRepository>(Types.catalog.repository).to(CatalogRepositoryImpl).inSingletonScope();
        bind<AddCatalogItem>(Types.catalog.addCatalogItem).to(AddCatalogItem).inTransientScope();
        bind<GetCatalogItemById>(Types.catalog.getCatalogItemById).to(GetCatalogItemById).inTransientScope();
        bind<GetCatalogItemsByTags>(Types.catalog.getCatalogItemsByTags).to(GetCatalogItemsByTags).inTransientScope();
        bind<UpdateCatalogItem>(Types.catalog.updateCatalogItem).to(UpdateCatalogItem).inTransientScope();
        bind<RemoveCatalogItem>(Types.catalog.removeCatalogItem).to(RemoveCatalogItem).inTransientScope();
    });
}