import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {Collection} from "mongodb";
import {Database} from "../database/Database";
import {CategoryServiceServer} from "../generated/category";
import {Category} from "../category/Category";
import {CategoryService} from "../category/CategoryService";
import {CategoryRepository, CategoryRepositoryImpl} from "../category/CategoryRepository";
import {AddCategory} from "../category/AddCategory";
import {GetCategoryById} from "../category/GetCategoryById";
import {GetCategories} from "../category/GetCategories";
import {UpdateCategory} from "../category/UpdateCategory";
import {RemoveCategory} from "../category/RemoveCategory";
import {GetCategoriesByTags} from "../category/GetCategoriesByTags";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, category].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const category = new ContainerModule(bind => {
        bind<Collection<Category>>(Types.category.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<Category>(container.get<Config>(Types.app.config).COLLECTION_ITEMS!)!;
        }).inSingletonScope();
        bind<CategoryServiceServer>(Types.category.service).to(CategoryService).inSingletonScope();
        bind<CategoryRepository>(Types.category.repository).to(CategoryRepositoryImpl).inSingletonScope();
        bind<AddCategory>(Types.category.addCategory).to(AddCategory).inTransientScope();
        bind<GetCategoryById>(Types.category.getCategoryById).to(GetCategoryById).inTransientScope();
        bind<GetCategories>(Types.category.getCategories).to(GetCategories).inTransientScope();
        bind<GetCategoriesByTags>(Types.category.getCategoriesByTags).to(GetCategoriesByTags).inTransientScope();
        bind<UpdateCategory>(Types.category.updateCategory).to(UpdateCategory).inTransientScope();
        bind<RemoveCategory>(Types.category.removeCategory).to(RemoveCategory).inTransientScope();
    });
}