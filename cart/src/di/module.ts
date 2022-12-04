import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Cache} from "../cache/Cache";
import {CartService} from "../cart/CartService";
import {CartRepository, CartRepositoryImpl} from "../cart/CartRepository";
import {GetItems} from "../cart/GetItems";
import {AddItem} from "../cart/AddItem";
import {RemoveItem} from "../cart/RemoveItem";
import {ClearCart} from "../cart/ClearCart";
import {CartServiceServer} from "../generated/cart";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, cart].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Cache>(Types.app.cache).to(Cache).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const cart = new ContainerModule(bind => {
        bind<CartServiceServer>(Types.cart.service).to(CartService).inSingletonScope();
        bind<CartRepository>(Types.cart.repository).to(CartRepositoryImpl).inSingletonScope();
        bind<GetItems>(Types.cart.getItemsFromCart).to(GetItems).inTransientScope();
        bind<AddItem>(Types.cart.addItemToCart).to(AddItem).inTransientScope();
        bind<RemoveItem>(Types.cart.removeItemFromCart).to(RemoveItem).inTransientScope();
        bind<ClearCart>(Types.cart.clearCart).to(ClearCart).inTransientScope();
    });
}