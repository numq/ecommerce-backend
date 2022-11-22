import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Category} from "./Category";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";
import {Exception} from "../exception/Exception";
import {Either} from "fp-ts/Either";

@injectable()
export class UpdateCategory extends UseCase<Category, Category> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: Category): Either<Exception, Category> {
        return this.repository.updateCategory(arg);
    }
}