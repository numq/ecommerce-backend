import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Cache} from "../cache/Cache";
import {CartService} from "../cart/CartService";
import {CartRepository, CartRepositoryImpl} from "../cart/CartRepository";
import {GetCart} from "../cart/GetCart";
import {IncreaseItemQuantity} from "../cart/IncreaseItemQuantity";
import {ClearCart} from "../cart/ClearCart";
import {CartServiceServer} from "../generated/cart";
import {DecreaseItemQuantity} from "../cart/DecreaseItemQuantity";

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
        bind<GetCart>(Types.cart.getCart).to(GetCart).inTransientScope();
        bind<IncreaseItemQuantity>(Types.cart.increaseItemQuantity).to(IncreaseItemQuantity).inTransientScope();
        bind<DecreaseItemQuantity>(Types.cart.decreaseItemQuantity).to(DecreaseItemQuantity).inTransientScope();
        bind<ClearCart>(Types.cart.clearCart).to(ClearCart).inTransientScope();
    });
}