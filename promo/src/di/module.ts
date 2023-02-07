import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Store} from "../store/Store";
import {Types} from "./types";
import {PromoServiceServer} from "../promo/PromoServiceServer";
import {PromoRepository, PromoRepositoryImpl} from "../promo/PromoRepository";
import {Server} from "../server/Server";
import {InsertPromo} from "../promo/InsertPromo";
import {GetPromo} from "../promo/GetPromo";
import {RemovePromo} from "../promo/RemovePromo";
import {PromoService} from "../promo/PromoService";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, promo].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Store>(Types.app.store).to(Store).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const promo = new ContainerModule(bind => {
        bind<PromoServiceServer>(Types.promo.service).to(PromoService).inSingletonScope();
        bind<PromoRepository>(Types.promo.repository).to(PromoRepositoryImpl).inSingletonScope();
        bind<InsertPromo>(Types.promo.insertPromo).to(InsertPromo).inTransientScope();
        bind<GetPromo>(Types.promo.getPromo).to(GetPromo).inTransientScope();
        bind<RemovePromo>(Types.promo.removePromo).to(RemovePromo).inTransientScope();
    });
}