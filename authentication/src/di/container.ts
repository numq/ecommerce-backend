import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {ConfigProvider} from "../config/ConfigProvider";
import {Database} from "../database/Database";
import {Store} from "../store/Store";
import {TokenData, TokenRepository} from "../token/TokenRepository";

export const container = new Container({defaultScope: "Singleton"})
container.bind<ConfigProvider>(TYPES.ConfigProvider).to(ConfigProvider);
container.bind<Database>(TYPES.Database).to(Database)
container.bind<Store>(TYPES.Store).to(Store)
container.bind<TokenRepository>(TYPES.TokenRepository).to(TokenData)