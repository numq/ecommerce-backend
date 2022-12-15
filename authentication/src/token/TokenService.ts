import {inject, injectable} from "inversify";
import {Types} from "../di/types";
import {VerifyAccessToken} from "./VerifyAccessToken";
import {
    RefreshAccessTokenRequest,
    RefreshAccessTokenResponse,
    TokenServiceServer,
    VerifyAccessTokenRequest,
    VerifyAccessTokenResponse
} from "../generated/token";
import {sendUnaryData, ServerUnaryCall, UntypedHandleCall} from "@grpc/grpc-js";
import {response} from "../response";
import {RefreshAccessToken} from "./RefreshAccessToken";

@injectable()
export class TokenService implements TokenServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.token.verifyAccessToken) private readonly verifyAccessTokenUseCase: VerifyAccessToken,
        @inject(Types.token.refreshAccessToken) private readonly refreshAccessTokenUseCase: RefreshAccessToken
    ) {
    }

    verifyAccessToken = (call: ServerUnaryCall<VerifyAccessTokenRequest, VerifyAccessTokenResponse>, callback: sendUnaryData<VerifyAccessTokenResponse>) => {
        const {accessToken} = call.request;
        response(this.verifyAccessTokenUseCase.execute(accessToken), callback, value => ({id: value}));
    }
    refreshAccessToken = (call: ServerUnaryCall<RefreshAccessTokenRequest, RefreshAccessTokenResponse>, callback: sendUnaryData<RefreshAccessTokenResponse>) => {
        const {refreshToken} = call.request;
        response(this.refreshAccessTokenUseCase.execute(refreshToken), callback, ([refreshToken, accessToken]) => ({
            refreshToken: refreshToken,
            accessToken: accessToken
        }));
    }
}