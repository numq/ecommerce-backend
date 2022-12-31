import {UseCase} from "../interactor/UseCase";
import {Profile} from "./Profile";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {ProfileRepository} from "./ProfileRepository";
import {ProfileError} from "./ProfileError";
import {taskEither as TE} from "fp-ts";

@injectable()
export class CreateProfile extends UseCase<Profile, string> {
    constructor(@inject(Types.profile.repository) private readonly repository: ProfileRepository) {
        super();
    }

    execute = (arg: Profile): TaskEither<Error, string> => pipe(
        this.repository.createProfile(arg),
        TE.chain(TE.fromNullable(ProfileError.NotFound))
    );
}