import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Category} from "./Category";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";
import {Either} from "fp-ts/Either";
import {Exception} from "../exception/Exception";

@injectable()
export class GetCategoryById extends UseCase<string, Category> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: string): Either<Exception, Category> {
        return this.repository.getCategoryById(arg);
    }
}