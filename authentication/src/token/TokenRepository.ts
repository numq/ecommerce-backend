import {TaskEither} from "fp-ts/TaskEither";
import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {pipe} from "fp-ts/function";
import {taskEither as TE} from "fp-ts";
import {Config} from "../config/Config";
import {sign, verify} from "jsonwebtoken";
import {Account} from "../account/Account";
import {TokenError} from "./TokenError";
import {Collection, ObjectId} from "mongodb";
import {AccountPayload} from "../account/AccountPayload";
import {RefreshToken} from "./RefreshToken";
import {DatabaseError} from "../database/DatabaseError";

export interface TokenRepository {
    generateAccessToken(account: Account): TaskEither<Error, string>

    generateRefreshToken(account: Account): TaskEither<Error, string>

    verifyToken(token: string): TaskEither<Error, Account>
}

@injectable()
export class TokenRepositoryImpl implements TokenRepository {
    constructor(
        @inject(Types.app.config) private readonly config: Config,
        @inject(Types.token.collection) private readonly collection: Collection<RefreshToken>
    ) {
    }

    generateAccessToken = (account: Account): TaskEither<Error, string> => {
        return TE.tryCatch(() => Promise.resolve(sign(account, this.config.SECRET_KEY, {expiresIn: "1800s"})), (e: Error | any) => e ? e : TokenError.generateAccessToken);
    }

    generateRefreshToken = (account: Account): TaskEither<Error, string> => {
        return pipe(
            TE.Do,
            TE.bind("id", () => TE.tryCatch(() => Promise.resolve(new ObjectId()), () => DatabaseError.id)),
            TE.bind("token", () => TE.tryCatch(() => Promise.resolve(sign(account, this.config.SECRET_KEY, {expiresIn: "30d"})), (e: Error | any) => e ? e : TokenError.generateRefreshToken)),
            TE.bind("date", () => TE.right(new Date().getTime())),
            TE.chainFirst(({id, token, date}) => pipe(
                TE.fromTask(() => this.collection.insertOne({
                    _id: id,
                    id: id.toHexString(),
                    value: token,
                    accountId: account.id,
                    createdAt: date
                })),
                TE.chain(() => TE.fromTask(() => this.collection.find({accountId: account.id}, {}).sort({createdAt: -1}).toArray())),
                TE.chain(TE.fromNullable(DatabaseError.find)),
                TE.chain(array => {
                    if (array.length > 4) {
                        const lastItem = array.pop();
                        if (lastItem) {
                            return pipe(
                                TE.fromTask(() => this.collection.deleteOne({id: lastItem.id})),
                                TE.map(result => result.deletedCount)
                            );
                        }
                    }
                    return TE.right(0);
                })
            )),
            TE.map(({token}) => token)
        );
    }

    verifyToken = (token: string): TaskEither<Error, Account> => {
        return pipe(
            TE.tryCatch(() => Promise.resolve(verify(token, this.config.SECRET_KEY) as AccountPayload), (e: Error | any) => e ? e : TokenError.verify),
            TE.map(payload => ({
                id: payload.id,
                credentials: payload.credentials,
                credentialType: payload.credentialType,
                role: payload.role,
                createdAt: payload.createdAt,
                updatedAt: payload.updatedAt
            }))
        );
    }
}