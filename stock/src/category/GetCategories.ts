import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";
import {UseCase} from "../interactor/UseCase";
import {Category} from "./Category";
import {Either} from "fp-ts/Either";
import {Exception} from "../exception/Exception";

@injectable()
export class GetCategories extends UseCase<void, Category[]> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: any): Either<Exception, Category[]> {
        return this.repository.getCategories();
    }
}