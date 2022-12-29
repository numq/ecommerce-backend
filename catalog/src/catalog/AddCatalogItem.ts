import {inject, injectable} from "inversify";
import {CatalogRepository} from "./CatalogRepository";
import {UseCase} from "../interactor/UseCase";
import {CatalogItem} from "./CatalogItem";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CatalogError} from "./CatalogError";

@injectable()
export class AddCatalogItem extends UseCase<CatalogItem, string> {
    constructor(@inject(Types.catalog.repository) private readonly repository: CatalogRepository) {
        super();
    }

    execute = (arg: CatalogItem): TaskEither<Error, string> => pipe(
        this.repository.addItem(arg),
        TE.chain(TE.fromNullable(CatalogError.NotFound))
    );
}