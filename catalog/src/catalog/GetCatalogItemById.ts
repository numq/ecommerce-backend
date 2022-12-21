import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {CatalogItem} from "./CatalogItem";
import {Types} from "../di/types";
import {CatalogRepository} from "./CatalogRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class GetCatalogItemById extends UseCase<string, CatalogItem> {
    constructor(@inject(Types.catalog.repository) private readonly repository: CatalogRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, CatalogItem> {
        return this.repository.getItemById(arg);
    }
}