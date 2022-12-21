import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {CatalogRepository} from "./CatalogRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class RemoveCatalogItem extends UseCase<string, string> {
    constructor(@inject(Types.catalog.repository) private readonly repository: CatalogRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, string> {
        return this.repository.removeItem(arg);
    }
}