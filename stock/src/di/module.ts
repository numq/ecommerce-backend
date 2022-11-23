import "reflect-metadata";
import {Container, ContainerModule} from "inversify";
import {Config} from "../config/Config";
import {Types} from "./types";
import {Server} from "../server/Server";
import {ProductService} from "../product/ProductService";
import {ProductRepository, ProductRepositoryImpl} from "../product/ProductRepository";
import {AddProduct} from "../product/AddProduct";
import {UpdateProduct} from "../product/UpdateProduct";
import {RemoveProduct} from "../product/RemoveProduct";
import {GetProductById} from "../product/GetProductById";
import {GetProductsFromCategory} from "../product/GetProductsFromCategory";
import {ProductServiceServer} from "../generated/product";
import {Collection} from "mongodb";
import {Database} from "../database/Database";
import {AddCategory} from "../category/AddCategory";
import {GetCategoryById} from "../category/GetCategoryById";
import {GetCategories} from "../category/GetCategories";
import {UpdateCategory} from "../category/UpdateCategory";
import {RemoveCategory} from "../category/RemoveCategory";
import {CategoryServiceServer} from "../generated/category";
import {CategoryRepository, CategoryRepositoryImpl} from "../category/CategoryRepository";
import {CategoryService} from "../category/CategoryService";
import {Product} from "../product/Product";
import {Category} from "../category/Category";

export namespace Module {

    export const container = new Container({defaultScope: "Singleton", skipBaseClassChecks: true});
    export const initModules = () => [app, category, product].forEach(m => container.load(m));

    const app = new ContainerModule(bind => {
        bind<Config>(Types.app.config).to(Config).inSingletonScope();
        bind<Database>(Types.app.database).to(Database).inSingletonScope();
        bind<Server>(Types.app.server).to(Server).inSingletonScope();
    });

    const category = new ContainerModule(bind => {
        bind<Collection<Category>>(Types.category.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<Category>(container.get<Config>(Types.app.config).COLLECTION_CATEGORIES!)!
        }).inSingletonScope();
        bind<CategoryRepository>(Types.category.repository).to(CategoryRepositoryImpl).inSingletonScope();
        bind<CategoryServiceServer>(Types.category.service).to(CategoryService).inSingletonScope();
        bind<AddCategory>(Types.category.addCategory).to(AddCategory).inTransientScope();
        bind<GetCategoryById>(Types.category.getCategoryById).to(GetCategoryById).inTransientScope();
        bind<GetCategories>(Types.category.getCategories).to(GetCategories).inTransientScope();
        bind<UpdateCategory>(Types.category.updateCategory).to(UpdateCategory).inTransientScope();
        bind<RemoveCategory>(Types.category.removeCategory).to(RemoveCategory).inTransientScope();
    });

    const product = new ContainerModule(bind => {
        bind<Collection<Product> | null>(Types.product.collection).toDynamicValue(() => {
            return container.get<Database>(Types.app.database).collection<Product>(container.get<Config>(Types.app.config).COLLECTION_PRODUCTS!)!;
        }).inSingletonScope();
        bind<ProductServiceServer>(Types.product.service).to(ProductService).inSingletonScope();
        bind<ProductRepository>(Types.product.repository).to(ProductRepositoryImpl).inSingletonScope();
        bind<AddProduct>(Types.product.addProduct).to(AddProduct).inTransientScope();
        bind<GetProductById>(Types.product.getProductById).to(GetProductById).inTransientScope();
        bind<GetProductsFromCategory>(Types.product.getProductsFromCategory).to(GetProductsFromCategory).inTransientScope();
        bind<UpdateProduct>(Types.product.updateProduct).to(UpdateProduct).inTransientScope();
        bind<RemoveProduct>(Types.product.removeProduct).to(RemoveProduct).inTransientScope();
    });
}