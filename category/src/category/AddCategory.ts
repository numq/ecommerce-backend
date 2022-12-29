import {inject, injectable} from "inversify";
import {Category} from "./Category";
import {CategoryRepository} from "./CategoryRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {CategoryError} from "./CategoryError";

@injectable()
export class AddCategory extends UseCase<Category, string> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute = (arg: Category): TaskEither<Error, string> => pipe(
        this.repository.addCategory(arg),
        TE.chain(TE.fromNullable(CategoryError.NotFound))
    );
}