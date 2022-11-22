import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {CategoryRepository} from "./CategoryRepository";
import {Exception} from "../exception/Exception";
import {Either} from "fp-ts/Either";

@injectable()
export class RemoveCategory extends UseCase<string, string> {
    constructor(@inject(Types.category.repository) private readonly repository: CategoryRepository) {
        super();
    }

    execute(arg: string): Either<Exception, string> {
        return this.repository.removeCategory(arg);
    }
}