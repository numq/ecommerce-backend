import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {CatalogItem} from "./CatalogItem";
import {Types} from "../di/types";
import {CatalogRepository} from "./CatalogRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class GetCatalogItemsByCategory extends UseCase<[string, number, number], CatalogItem[]> {
    constructor(@inject(Types.catalog.repository) private readonly repository: CatalogRepository) {
        super();
    }

    execute(arg: [string, number, number]): TaskEither<Error, CatalogItem[]> {
        return this.repository.getItemsByCategory(...arg);
    }
}