import {CredentialType} from "./CredentialType";

export type Account = {
    id: string;
    credentials: string;
    credentialType: CredentialType;
    createdAt: number;
    updatedAt: number;
};