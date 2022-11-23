import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";
import {UseCase} from "../interactor/UseCase";
import {Category} from "./Category";
import {TaskEither} from "fp-ts/TaskEither";

@injectable()
export class GetCategories extends UseCase<void, Category[]> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: void): TaskEither<Error, Category[]> {
        return this.repository.getCategories();
    }
}