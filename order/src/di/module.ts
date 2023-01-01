import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Collection} from "mongodb";
import {Database} from "../database/Database";
import {OrderService} from "../order/OrderService";
import {OrderRepository, OrderRepositoryImpl} from "../order/OrderRepository";
import {CreateOrder} from "../order/CreateOrder";
import {Order} from "../order/Order";
import {GetOrderById} from "../order/GetOrderById";
import {GetCustomerOrders} from "../order/GetCustomerOrders";
import {UpdateOrder} from "../order/UpdateOrder";
import {DeleteOrder} from "../order/DeleteOrder";
import {OrderServiceServer} from "../generated/order";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, order].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const order = new ContainerModule(bind => {
        bind<Collection<Order>>(Types.order.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<Order>(container.get<Config>(Types.app.config).COLLECTION_ITEMS!)!;
        }).inSingletonScope();
        bind<OrderServiceServer>(Types.order.service).to(OrderService).inSingletonScope();
        bind<OrderRepository>(Types.order.repository).to(OrderRepositoryImpl).inSingletonScope();
        bind<CreateOrder>(Types.order.createOrder).to(CreateOrder).inTransientScope();
        bind<GetOrderById>(Types.order.getOrderById).to(GetOrderById).inTransientScope();
        bind<GetCustomerOrders>(Types.order.getCustomerOrders).to(GetCustomerOrders).inTransientScope();
        bind<UpdateOrder>(Types.order.updateOrder).to(UpdateOrder).inTransientScope();
        bind<DeleteOrder>(Types.order.deleteOrder).to(DeleteOrder).inTransientScope();
    });
}