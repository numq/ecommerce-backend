import {inject, injectable} from "inversify";
import {TaskEither} from "fp-ts/TaskEither";
import {Types} from "../di/types";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {Collection, ObjectId} from "mongodb";
import {Account} from "./Account";
import {DatabaseError} from "../database/DatabaseError";
import {CredentialType} from "../confirmation/CredentialType";
import {Role} from "./Role";

export interface AccountRepository {
    addAccount(credentials: string, credentialType: CredentialType, role: Role): TaskEither<Error, string>

    getAccountById(id: string): TaskEither<Error, Account>

    getAccountByCredentials(credentials: string): TaskEither<Error, Account>

    getAccountByCredentialsOrNull(credentials: string): TaskEither<Error, Account | null>

    updateAccount(account: Account): TaskEither<Error, Account>

    removeAccount(id: string): TaskEither<Error, string>
}

@injectable()
export class AccountRepositoryImpl implements AccountRepository {
    private readonly collection: Collection<Account>

    constructor(
        @inject(Types.account.collection) collection: Collection<Account>
    ) {
        this.collection = collection;
    }

    addAccount = (credentials: string, credentialType: CredentialType, role: Role): TaskEither<Error, string> => {
        return pipe(
            TE.tryCatch(() => Promise.resolve<[ObjectId, number]>([new ObjectId(), new Date().getTime()]), () => DatabaseError.id),
            TE.chain(([id, timestamp]: [ObjectId, number]) =>
                TE.fromTask(() => this.collection.insertOne({
                    _id: id,
                    id: id.toHexString(),
                    credentials: credentials,
                    credentialType: credentialType,
                    role: role,
                    createdAt: timestamp,
                    updatedAt: timestamp
                }))),
            TE.mapLeft(() => DatabaseError.insert),
            TE.map(_ => _.insertedId.toHexString())
        );
    }

    getAccountById = (id: string): TaskEither<Error, Account> => {
        return pipe(
            TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(id)})),
            TE.chain(TE.fromNullable(DatabaseError.findOne))
        );
    }

    getAccountByCredentials = (credentials: string): TaskEither<Error, Account> => {
        return pipe(
            TE.fromTask(() => this.collection.findOne({credentials: credentials})),
            TE.chain(TE.fromNullable(DatabaseError.findOne))
        );
    }

    getAccountByCredentialsOrNull = (credentials: string): TaskEither<Error, Account | null> => {
        return pipe(
            TE.fromTask(() => this.collection.findOne({credentials: credentials})),
            TE.mapLeft(() => DatabaseError.findOne)
        );
    }

    removeAccount = (id: string): TaskEither<Error, string> => {
        return pipe(
            TE.fromTask(() => this.collection.deleteOne({_id: ObjectId.createFromHexString(id)})),
            TE.mapLeft(() => DatabaseError.deleteOne),
            TE.map(() => id)
        );
    }

    updateAccount = (account: Account): TaskEither<Error, Account> => {
        return pipe(
            TE.fromTask(() => this.collection.updateOne({_id: ObjectId.createFromHexString(account.id)}, {
                $set: {
                    credentials: account.credentials,
                    updatedAt: new Date().getTime()
                }
            })),
            TE.mapLeft(() => DatabaseError.update),
            TE.chain(() => TE.fromTask(() => this.collection.findOne({_id: ObjectId.createFromHexString(account.id)}))),
            TE.chain(TE.fromNullable(DatabaseError.findOne))
        );
    }
}