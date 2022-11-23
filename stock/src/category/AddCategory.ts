import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Category} from "./Category";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class AddCategory extends UseCase<Category, string> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: Category): TaskEither<Error, string> {
        return this.repository.addCategory(arg);
    }
}