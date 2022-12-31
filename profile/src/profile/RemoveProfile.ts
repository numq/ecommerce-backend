import {inject, injectable} from "inversify";
import {UseCase} from "../interactor/UseCase";
import {Types} from "../di/types";
import {ProfileRepository} from "./ProfileRepository";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {ProfileError} from "./ProfileError";

@injectable()
export class RemoveProfile extends UseCase<string, string> {
    constructor(@inject(Types.profile.repository) private readonly repository: ProfileRepository) {
        super();
    }

    execute = (arg: string): TaskEither<Error, string> => pipe(
        this.repository.removeProfile(arg),
        TE.chain(TE.fromNullable(ProfileError.NotFound))
    );
}