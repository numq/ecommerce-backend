import {inject, injectable} from "inversify";
import {CategoryRepository} from "./CategoryRepository";
import {Category} from "./Category";
import {TaskEither} from "fp-ts/TaskEither";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";

@injectable()
export class GetCategories extends UseCase<[number, number], Category[]> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: [number, number]): TaskEither<Error, Category[]> {
        return this.repository.getCategories(...arg);
    }
}