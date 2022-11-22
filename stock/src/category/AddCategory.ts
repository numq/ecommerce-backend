import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Exception} from "../exception/Exception";
import {Category} from "./Category";
import {Either} from "fp-ts/Either";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";

@injectable()
export class AddCategory extends UseCase<Category, string> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: Category): Either<Exception, string> {
        return this.repository.addCategory(arg);
    }
}