import {inject, injectable} from "inversify";
import {
    CreateProfileRequest,
    CreateProfileResponse,
    GetProfileByIdRequest,
    GetProfileByIdResponse,
    ProfileServiceServer,
    RemoveProfileRequest,
    RemoveProfileResponse,
    UpdateProfileRequest,
    UpdateProfileResponse
} from "../generated/profile";
import {sendUnaryData, ServerUnaryCall, status, UntypedHandleCall} from "@grpc/grpc-js";
import {ProfileMapper} from "./ProfileMapper";
import {RemoveProfile} from "./RemoveProfile";
import {UpdateProfile} from "./UpdateProfile";
import {GetProfileById} from "./GetProfileById";
import {CreateProfile} from "./CreateProfile";
import {Types} from "../di/types";
import {response} from "../response";

@injectable()
export class ProfileService implements ProfileServiceServer {
    [name: string]: UntypedHandleCall | any;

    constructor(
        @inject(Types.profile.createProfile) private readonly createProfileUseCase: CreateProfile,
        @inject(Types.profile.getProfileById) private readonly getProfileByIdUseCase: GetProfileById,
        @inject(Types.profile.updateProfile) private readonly updateProfileUseCase: UpdateProfile,
        @inject(Types.profile.removeProfile) private readonly removeProfileUseCase: RemoveProfile
    ) {
    }

    createProfile = (call: ServerUnaryCall<CreateProfileRequest, CreateProfileResponse>, callback: sendUnaryData<CreateProfileResponse>) => {
        const {profile} = call.request;
        if (profile) {
            return response(this.createProfileUseCase.execute(profile), callback, value => ({id: value}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    getProfileById = (call: ServerUnaryCall<GetProfileByIdRequest, GetProfileByIdResponse>, callback: sendUnaryData<GetProfileByIdResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.getProfileByIdUseCase.execute(id), callback, value => ({profile: ProfileMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    removeProfile = (call: ServerUnaryCall<RemoveProfileRequest, RemoveProfileResponse>, callback: sendUnaryData<RemoveProfileResponse>) => {
        const {id} = call.request;
        if (id) {
            return response(this.removeProfileUseCase.execute(id), callback, value => ({id: value}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };

    updateProfile = (call: ServerUnaryCall<UpdateProfileRequest, UpdateProfileResponse>, callback: sendUnaryData<UpdateProfileResponse>) => {
        const {profile} = call.request;
        if (profile) {
            return response(this.updateProfileUseCase.execute(profile), callback, value => ({profile: ProfileMapper.entityToMessage(value)}));
        }
        return callback({code: status.INVALID_ARGUMENT});
    };
}