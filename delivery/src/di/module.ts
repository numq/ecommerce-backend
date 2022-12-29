import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Collection} from "mongodb";
import {Database} from "../database/Database";
import {Delivery} from "../delivery/Delivery";
import {DeliveryRepository, DeliveryRepositoryImpl} from "../delivery/DeliveryRepository";
import {GetDeliveriesByCourierId} from "../delivery/GetDeliveriesByCourierId";
import {GetDeliveriesByOrderId} from "../delivery/GetDeliveriesByOrderId";
import {StartDelivery} from "../delivery/StartDelivery";
import {UpdateDelivery} from "../delivery/UpdateDelivery";
import {CancelDelivery} from "../delivery/CancelDelivery";
import {RemoveDelivery} from "../delivery/RemoveDelivery";
import {GetDeliveryById} from "../delivery/GetDeliveryById";
import {CompleteDelivery} from "../delivery/CompleteDelivery";
import {DeliveryServiceServer} from "../generated/delivery";
import {DeliveryService} from "../delivery/DeliveryService";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, delivery].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const delivery = new ContainerModule(bind => {
        bind<Collection<Delivery>>(Types.delivery.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<Delivery>(container.get<Config>(Types.app.config).COLLECTION_ITEMS!)!;
        }).inSingletonScope();
        bind<DeliveryServiceServer>(Types.delivery.service).to(DeliveryService).inSingletonScope();
        bind<DeliveryRepository>(Types.delivery.repository).to(DeliveryRepositoryImpl).inSingletonScope();
        bind<StartDelivery>(Types.delivery.startDelivery).to(StartDelivery).inTransientScope();
        bind<GetDeliveryById>(Types.delivery.getDeliveryById).to(GetDeliveryById).inTransientScope();
        bind<GetDeliveriesByCourierId>(Types.delivery.getDeliveriesByCourierId).to(GetDeliveriesByCourierId).inTransientScope();
        bind<GetDeliveriesByOrderId>(Types.delivery.getDeliveriesByOrderId).to(GetDeliveriesByOrderId).inTransientScope();
        bind<UpdateDelivery>(Types.delivery.updateDelivery).to(UpdateDelivery).inTransientScope();
        bind<CancelDelivery>(Types.delivery.cancelDelivery).to(CancelDelivery).inTransientScope();
        bind<CompleteDelivery>(Types.delivery.completeDelivery).to(CompleteDelivery).inTransientScope();
        bind<RemoveDelivery>(Types.delivery.removeDelivery).to(RemoveDelivery).inTransientScope();
    });
}