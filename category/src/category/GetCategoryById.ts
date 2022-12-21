import {inject, injectable} from "inversify";
import {Category} from "./Category";
import {CategoryRepository} from "./CategoryRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";

@injectable()
export class GetCategoryById extends UseCase<string, Category> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, Category> {
        return this.repository.getCategoryById(arg);
    }
}