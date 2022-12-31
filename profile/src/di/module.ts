import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Collection} from "mongodb";
import {Database} from "../database/Database";
import {Profile} from "../profile/Profile";
import {ProfileRepository, ProfileRepositoryImpl} from "../profile/ProfileRepository";
import {ProfileService} from "../profile/ProfileService";
import {ProfileServiceServer} from "../generated/profile";
import {CreateProfile} from "../profile/CreateProfile";
import {GetProfileById} from "../profile/GetProfileById";
import {UpdateProfile} from "../profile/UpdateProfile";
import {RemoveProfile} from "../profile/RemoveProfile";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, profile].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const profile = new ContainerModule(bind => {
        bind<Collection<Profile>>(Types.profile.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<Profile>(container.get<Config>(Types.app.config).COLLECTION_ITEMS!)!;
        }).inSingletonScope();
        bind<ProfileServiceServer>(Types.profile.service).to(ProfileService).inSingletonScope();
        bind<ProfileRepository>(Types.profile.repository).to(ProfileRepositoryImpl).inSingletonScope();
        bind<CreateProfile>(Types.profile.createProfile).to(CreateProfile).inTransientScope();
        bind<GetProfileById>(Types.profile.getProfileById).to(GetProfileById).inTransientScope();
        bind<UpdateProfile>(Types.profile.updateProfile).to(UpdateProfile).inTransientScope();
        bind<RemoveProfile>(Types.profile.removeProfile).to(RemoveProfile).inTransientScope();
    });
}