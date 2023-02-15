import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {Collection, ObjectId} from "mongodb";
import {Profile} from "./Profile";
import {TaskEither} from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";

export interface ProfileRepository {
    createProfile(profile: Profile): TaskEither<Error, string | null>

    getProfileById(id: string): TaskEither<Error, Profile | null>

    updateProfile(profile: Profile): TaskEither<Error, Profile | null>

    removeProfile(id: string): TaskEither<Error, string | null>
}

@injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
    constructor(@inject(Types.profile.collection) private readonly collection: Collection<Profile>) {
    }

    createProfile = (profile: Profile): TaskEither<Error, string | null> => pipe(
        TE.fromTask(() => this.collection.insertOne({
            _id: ObjectId.createFromHexString(profile.id),
            id: profile.id,
            name: profile.name,
            addresses: []
        })),
        TE.map(({insertedId}) => insertedId.toHexString())
    );

    getProfileById = (id: string): TaskEither<Error, Profile | null> => pipe(
        TE.fromTask(() => this.collection.findOne({id: id}))
    );

    updateProfile = (item: Profile): TaskEither<Error, Profile | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndUpdate({id: item.id}, item)),
        TE.map(({value}) => value)
    );

    removeProfile = (id: string): TaskEither<Error, string | null> => pipe(
        TE.fromTask(() => this.collection.findOneAndDelete({id: id})),
        TE.map(({value}) => value ? id : null)
    );
}