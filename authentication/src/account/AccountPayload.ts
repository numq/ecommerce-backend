import {CredentialType} from "./CredentialType";

export interface AccountPayload {
    id: string;
    credentials: string;
    credentialType: CredentialType;
    createdAt: number;
    updatedAt: number;
}