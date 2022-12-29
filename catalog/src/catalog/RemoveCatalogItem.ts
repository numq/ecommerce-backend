import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {CatalogRepository} from "./CatalogRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CatalogError} from "./CatalogError";

@injectable()
export class RemoveCatalogItem extends UseCase<string, string> {
    constructor(@inject(Types.catalog.repository) private readonly repository: CatalogRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, string> => pipe(
        this.repository.removeItem(arg),
        TE.chain(TE.fromNullable(CatalogError.NotFound))
    );
}