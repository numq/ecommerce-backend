import {CredentialType} from "../confirmation/CredentialType";
import {Role} from "./Role";

export interface AccountPayload {
    id: string;
    credentials: string;
    credentialType: CredentialType;
    role: Role;
    createdAt: number;
    updatedAt: number;
}