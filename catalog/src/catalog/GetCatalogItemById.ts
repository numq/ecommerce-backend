import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {CatalogItem} from "./CatalogItem";
import {Types} from "../di/types";
import {CatalogRepository} from "./CatalogRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CatalogError} from "./CatalogError";

@injectable()
export class GetCatalogItemById extends UseCase<string, CatalogItem> {
    constructor(@inject(Types.catalog.repository) private readonly repository: CatalogRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, CatalogItem> => pipe(
        this.repository.getItemById(arg),
        TE.chain(TE.fromNullable(CatalogError.NotFound))
    );
}