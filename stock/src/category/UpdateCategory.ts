import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Category} from "./Category";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class UpdateCategory extends UseCase<Category, Category> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: Category): TaskEither<Error, Category> {
        return this.repository.updateCategory(arg);
    }
}