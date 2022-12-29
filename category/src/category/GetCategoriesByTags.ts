import {inject, injectable} from "inversify";
import {CategoryRepository} from "./CategoryRepository";
import {Category} from "./Category";
import {TaskEither} from "fp-ts/TaskEither";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CategoryError} from "./CategoryError";

@injectable()
export class GetCategoriesByTags extends UseCase<[string[], number, number], Category[]> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute = (arg: [string[], number, number]): TaskEither<Error, Category[]> => pipe(
        this.repository.getCategoriesByTags(...arg),
        TE.chain(TE.fromNullable(CategoryError.NotFound))
    );
}