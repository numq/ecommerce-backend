import {inject, injectable} from "inversify";
import {CatalogRepository} from "./CatalogRepository";
import {UseCase} from "../interactor/UseCase";
import {CatalogItem} from "./CatalogItem";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class AddCatalogItem extends UseCase<CatalogItem, string> {
    constructor(@inject(Types.catalog.repository) private readonly repository: CatalogRepository) {
        super();
    }

    execute(arg: CatalogItem): TaskEither<Error, string> {
        return this.repository.addItem(arg);
    }
}