import {inject, injectable} from "inversify";
import {CategoryRepository} from "./CategoryRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";

@injectable()
export class RemoveCategory extends UseCase<string, string> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: string): TaskEither<Error, string> {
        return this.repository.removeCategory(arg);
    }
}